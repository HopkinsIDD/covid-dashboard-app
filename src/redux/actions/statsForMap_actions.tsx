import { StatsForMapActions, UPDATE_STATS_FOR_MAP } from "./actionTypes";
import { fetchJSON } from "../../utils/fetch";
import { Dispatch } from "redux";


export function setStatsForMap(payload: string): StatsForMapActions {
    return {
        type: UPDATE_STATS_FOR_MAP,
        statsForMap: payload
    };
}

// This function make an API call and then uses the result to update redux.
export function fetchStatsForMap() {
    return async (dispatch: Dispatch<StatsForMapActions>) => {
        try {
            console.log(`fetchStatsForMap(): attempting to fetch`);
            const response = await fetchJSON('statsForMap');
            dispatch(setStatsForMap(response))
        } catch (e) {
            console.log(`fetchStatsForMap(): error when fetching. message=${e.message}`)
        }
    };

}