import { StatsForMapsActions, UPDATE_STATS_FOR_MAPS } from "./actionTypes";
import { fetchJSON } from "../../utils/fetch";
import { Dispatch } from "redux";


export function setStatsForMaps(payload: string): StatsForMapsActions {
    return {
        type: UPDATE_STATS_FOR_MAPS,
        statsForMaps: payload
    };
}

// This function make an API call and then uses the result to update redux.
export function fetchStatsForMaps() {
    return async (dispatch: Dispatch<StatsForMapsActions>) => {
        try {
            console.log(`fetchStatsForMaps(): attempting to fetch`);

            // @lily, I'm getting a 403 so this fetch is always failing for me
            // const response = await fetchJSON('statsForMaps');
            // dispatch(setStatsForMaps(response.payload))
            dispatch(setStatsForMaps("HELLLLOOOOO WORLD"))
        } catch (e) {
            console.log(`fetchStatsForMaps(): error when fetching. message=${e.message}`)
        }
    };

}