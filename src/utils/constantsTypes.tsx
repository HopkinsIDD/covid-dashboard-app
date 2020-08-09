/**
 * Type file for constants.js
 */

export interface Indicator {
    id: number,
    key: string,
    name: string,
    disabled: boolean
}

export enum SeverityLevelEnum {
    high = 'high',
    med = 'med',
    low = 'low'
}

export interface SeverityLevel {
    id: number,
    key: SeverityLevelEnum.high | SeverityLevelEnum.med | SeverityLevelEnum.low
    name: string
}

export interface Scenario {
    id: number;
    key: any;
    name: any;
    checked: boolean;
    disabled: boolean;
}

export type GeoId = string
