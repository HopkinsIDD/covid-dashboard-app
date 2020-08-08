import { StatsForMapsActions, UPDATE_STATS_FOR_MAPS } from "../actions/actionTypes";


// This is where we set the initial state of statsToMap.
// I don't know what this object looks like so I just put a string.
const initialState: string = "initial state";

const statsForMap_reducers = (state = initialState, action: StatsForMapsActions) => {
    switch (action.type) {
        case UPDATE_STATS_FOR_MAPS: {
            return action.statsForMaps;
        }
        default: {
            return state;
        }
    }
};

export default statsForMap_reducers;
