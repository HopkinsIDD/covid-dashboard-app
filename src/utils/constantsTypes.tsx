/**
 * Type file for constants.js
 */

export interface Stat {
    id: number,
    key: string,
    name: string,
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

export type SeverityLevelList = Array<SeverityLevel>

export interface Scenario {
    id: number;
    key: any;
    name: any;
    checked: boolean;
    disabled: boolean;
}

export enum SelectModeEnum {
    chart = 'chart',
    map = 'map',
    graph = 'graph',
    multiple = 'multiple',

}

export type SelectMode =
    SelectModeEnum.chart |
    SelectModeEnum.map |
    SelectModeEnum.graph |
    SelectModeEnum.multiple
