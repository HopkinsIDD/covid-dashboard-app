export const UPDATE_STATS_FOR_MAPS = "UPDATE_STATS_FOR_MAPS";

export type UpdateStatsForMaps = {
    type: typeof UPDATE_STATS_FOR_MAPS,
    statsForMaps: string
}

export type StatsForMapsActions =
    UpdateStatsForMaps;