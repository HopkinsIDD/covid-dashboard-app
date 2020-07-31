export enum LabelClassNameEnum {
    underlineActive = 'underline-active',
    boldUnderline = 'bold underline',
}

export type LabelClassName =  'underline-active' | 'bold underline'

export function getLabelForActiveState(isActive: boolean): LabelClassName  {
    return isActive ? LabelClassNameEnum.underlineActive : LabelClassNameEnum.boldUnderline
}
