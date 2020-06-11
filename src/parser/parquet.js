const parquet = require('parquetjs');

// https://github.com/ironSource/parquetjs
// hospitalization.parquet (sim file) --> RangeError: Maximum call stack size exceeded
// inference.parquet (model parameters) --> invalid encoding: PLAIN_DICTIONARY

// node-parquet: issues with installation
// node-parquet@0.2.7 preinstall: `./build_parquet-cpp.sh`
// ./build_parquet-cpp.sh: line 19: cmake: command not found

async function readParquet(path) {
    try {
        // create new ParquetReader that reads from 'inference.parquet`
        let reader = await parquet.ParquetReader.openFile(path);

        // create a new cursor
        // let cursor = reader.getCursor(['time']);
        let cursor = reader.getCursor();

        // read all records from the file and print them
        let record = null;
        while (record === await cursor.next()) {
            console.log(record);
        }

        console.log('closing')
        await reader.close();
    } catch (err) {
        console.log(err)
    }
}

// const path = '/Users/lxu213/Documents/covid-dashboard-app/hospitalization.parquet';
const path = '/Users/lxu213/Documents/covid-dashboard-app/inference.parquet';
readParquet(path)

