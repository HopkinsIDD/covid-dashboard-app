
// TODO: move these to a separate file and populate for all counties and states
// public county model files on github
// const baseUrl = 'https://raw.githubusercontent.com/';
export const COUNTIES = [
    {'geoid': '06', 'name': 'California', 'usps': 'CA'},
    {'geoid': '36', 'name': 'New York', 'usps': 'NY'},
    {'geoid': '06037', 'name': 'Los Angeles County', 'usps': 'CA'},
    {'geoid': '06075', 'name': 'San Francisco County', 'usps': 'CA'},
    {'geoid': '06085', 'name': 'Santa Clara County', 'usps': 'CA'},
    {'geoid': '06019', 'name': 'Fresno County', 'usps': 'CA'},
    {'geoid': '06063', 'name': 'Plumas County', 'usps': 'CA'},
    {'geoid': '36005', 'name': 'Bronx County', 'usps': 'NY'},
    {'geoid': '36061', 'name': 'New York County', 'usps': 'NY'},
    {'geoid': '36081', 'name': 'Queens County', 'usps': 'NY'},
];

export const COUNTYNAMES = {
    '06': 'California',
    '36': 'New York',
    '06037': 'Los Angeles County, CA',
    '06085': 'Santa Clara County, CA',
    '06075': 'San Francisco County, CA',
    '06019': 'Fresno County, CA',
    '06063': 'Plumas County, CA',
    '36005': 'Bronx County, NY',
    '36061': 'New York County, NY',
    '36081': 'Queens County, NY'
}
