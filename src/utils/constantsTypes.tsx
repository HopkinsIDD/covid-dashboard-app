/**
 * Type file for constants.js
 */

export interface Stat {
    id: number,
    key: string,
    name: string,
}

export interface SeverityLevel {
    id: number,
    key: 'high' | 'med' | 'low'
    name: string
}

export type SeverityLevelList = Array<SeverityLevel>

export interface Scenario {
    id : number;
    key : any;
    name : any;
    checked : boolean;
    disabled : boolean;
}

export type ScenarioList = Array<Scenario>
