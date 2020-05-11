// TO RUN FILE: remove "type": "module" from package.json
// RangeError: Maximum call stack size exceeded
// https://github.com/ironSource/parquetjs
var parquet = require('parquetjs');

async function readData(path) {
    try {
        // create new ParquetReader that reads from 'fruits.parquet`
        let reader = await parquet.ParquetReader.openFile(path);

        // create a new cursor
        let cursor = reader.getCursor(['incidI']);

        // read all records from the file and print them
        let record = null;
        while (record === await cursor.next()) {
            console.log(record);
        }
    } catch (err) {
        console.error(err);
    }
}

const fileName = 'high_death_death-000000001.hosp.parquet';
const path = 'src/store/sims_pq/LockdownWideEffect/' + fileName;
readData(path);
