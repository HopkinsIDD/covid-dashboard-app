const fs = require('fs');
const axios = require('axios');
// const counties = require('../store/counties.txt');

// TODO: a lot of pre-processing is required due to the coronavirus-tracker-api
// data format (does not return counties by geoid, has its own id). Not sure if
// resarch time will be okay with NYT data, anyway - this work will be paused.

// move to utils 
function countiesByGeoid() {
    // returns Obj where geoid is key and val is obj with additional info such as
    // state usps, state FIPS, state name, nyt_id
}

function createNYTmapping() {
    // build a map with county, state as key and NYT-specific ID as value
    // {"County, State": nyt_id}
    
    const path = 'https://coronavirus-tracker-api.herokuapp.com/v2/locations?source=nyt';

    axios.get(path)
    .catch(error => {
        console.log('error', error);
    })
    .then(response => {
        const map = {};
        const counties = response.data.locations;

        for (let i = 0; i < counties.length; i ++) {
            map[`${counties[i].county}, ${counties[i].province}`] = counties[i].id
        }

        const json = JSON.stringify(map);

        fs.writeFile('src/store/nyt_ids.json', json, 'utf8', function(err) {
            if (err) throw err;
        });
    });
}

function returnNYTcountyID() {
    // given a geoid, need to find nyt equivalent "id"
    // returns NYT-specific ID given a Tuple of county and state

    console.log(counties)
    let id;

    return id;

}

function getActualData(geoid) {

    // const id = locateCounty(geoid);
    const id = 1;
    const base = 'https://coronavirus-tracker-api.herokuapp.com/v2/';
    const path = `${base}locations?id=${id}&source=nyt&timelines=true`

    axios.get(path)
    .catch(error => {
        console.log('error', error);
    })
    .then(response => {

        const json = response.data.locations[0]; 

        const infections = json.timelines.confirmed;
        const deaths = json.timelines.deaths;

        this.props.onCountySelect([infections, deaths]);
        this.setState({
            'infectActual': infections,
            'deathActual': deaths
        })
    });
}

createNYTmapping()
// locateCounty()
// getActualData()
