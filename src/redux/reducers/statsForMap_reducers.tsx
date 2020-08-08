import { UPDATE_STATS_FOR_MAPS, UpdateStatsForMaps } from "../actions/actionTypes";


// TS Note. Taking in a raw JSON string for now
const initialState: { statsForMaps: string } = {
    statsForMaps: ""
};

const statsForMap_reducers = (state = initialState, action: UpdateStatsForMaps) => {
    switch (action.type) {
        case UPDATE_STATS_FOR_MAPS: {
            alert("UPDATE_STATS_FOR_MAPS")
            return action.statsForMaps;
        }
        default: {
            return state;
        }
    }
};

export default statsForMap_reducers;
