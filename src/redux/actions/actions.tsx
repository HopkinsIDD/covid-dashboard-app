import { UPDATE_STATS_FOR_MAPS } from "./actionTypes";

export const setStatsForMaps = (content: JSON) => ({
    type: UPDATE_STATS_FOR_MAPS,
    statsForMaps: content
});
