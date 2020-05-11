const fs = require('fs');

module.exports = {
  initSeries: function initSeries(headers, parameters) {
    // build initial series and index mapping 
    // of selected parameters inside raw data headers
    // return series: Array of Objects, getIdx: Obj
    let series = [];
    let getIdx = Object();

    for (let i = 0; i < parameters.length; i ++) {
        getIdx[parameters[i]] = headers.indexOf(parameters[i])
        const stat = parameters[i];
        series.push({
            [stat]: {},
        });
    }
    return [series, getIdx];
  }, 
  
  initObj: function initObj(dates) {
    // scenario object initialization
    return {
        'dates': dates,
        'high': {
            'incidD': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidH': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidI': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidICU': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidVent': {
                'peak': 0,
                'sims': [],
                'conf': []
            }
        },
        'med': {
            'incidD': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidH': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidI': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidICU': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidVent': {
                'peak': 0,
                'sims': [],
                'conf': []
            }
        },
        'low': {
            'incidD': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidH': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidI': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidICU': {
                'peak': 0,
                'sims': [],
                'conf': []
            },
            'incidVent': {
                'peak': 0,
                'sims': [],
                'conf': []
            }
        }
    };    
  },

  getDates: function getDates(path) {
    // return Array of dates 
    let dates = new Set();

    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
            const splitLine = line.split(',')
            const date = splitLine[0]

            // skip header and empty lines
            if (date.length > 1 && date !== 'time') {
                dates.add(date);
            }
        });
    } catch (err) {
        console.error(err);
    }
    // console.log('dates', Array.from(dates).sort())
    return Array.from(dates).sort();
  },

  getHeaders: function getHeaders(path) {
    // return Array of headers 
    let headers = [];

    try {
        const data = fs.readFileSync(path, 'UTF-8');
        const lines = data.split(/\r?\n/);

        lines.forEach((line) => {
            const splitLine = line.split(',')
            const date = splitLine[0]
            if (date === 'time') {
                for (let i = 0; i < splitLine.length; i ++) {
                    headers.push(splitLine[i]);
                }
            }
        });
    } catch (err) {
        console.error(err);
    }
    return headers;
  },

  returnFilesBySev: function returnFilesBySev(files, severity) {
    const filesBySev = [];
    for (let i = 0; i < files.length; i++) {
        if (files[i].includes(severity)) {
            filesBySev.push(files[i]);
        };
    };
    return filesBySev;
  },

  convertD3: function convertD3(simNums, parameters, series) {
  // convert series to d3 friendly array
  const seriesD3 = {
      'incidI': [],
      'incidH': [],
      'incidD': [],
      'incidVent': [],
      'incidICU': []
  };

  for (let i = 0; i < parameters.length; i ++) {
      const stat = parameters[i]; 
      const simList = Array.from(simNums).sort(function(a, b) {return a-b});
      for (let j = 0; j < simList.length; j ++) {
          const simObj = series[i][stat][simList[j]];
          simObj.over = false;
          simObj.max = Math.max.apply(null, simObj.vals)
          seriesD3[stat].push(simObj)
      }
  };  

  return seriesD3;
  },

  calcQuartile: function calcQuartile(data, q) {
    data = data.sort((a, b) => {return a - b;});
    const position = ((data.length) - 1) * q;
    const base = Math.floor(position);
    const rest = position - base;
    if (data[base + 1] !== undefined) {
      return data[base] + rest * (data[base + 1] - data[base]);
    } else {
      return data[base];
    }
  }
}

