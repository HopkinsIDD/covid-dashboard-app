export const UPDATE_STATS_FOR_MAP = "UPDATE_STATS_FOR_MAP";

export type UpdateStatsForMap = {
    type: typeof UPDATE_STATS_FOR_MAP,
    statsForMap: string
}

export type StatsForMapActions =
    UpdateStatsForMap;