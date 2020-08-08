import { StatsForMapActions, UPDATE_STATS_FOR_MAP } from "../actions/actionTypes";


const initialState: string | null = null;

const statsForMap_reducers = (state = initialState, action: StatsForMapActions) => {
    switch (action.type) {
        case UPDATE_STATS_FOR_MAP: {
            return action.statsForMap;
        }
        default: {
            return state;
        }
    }
};

export default statsForMap_reducers;
