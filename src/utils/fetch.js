import { s3BucketUrl } from '../utils/constants';

export async function fetchJSON(fileName) {
    // fetch json for given fileName from s3 bucket
    // e.g. "06085", "statsForMap", "actuals"
    
    let response = await fetch(`${s3BucketUrl}${fileName}.json`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    } else {
        return await response.json();
    }
}