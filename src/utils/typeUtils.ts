export enum LabelClassNameEnum {
    underlineActive = 'underline-active',
    boldUnderline = 'bold underline',
}

export type LabelClassName =  'underline-active' | 'bold underline'

export function getClassForActiveState(isActive: boolean): LabelClassNameEnum {
    return isActive ? LabelClassNameEnum.underlineActive : LabelClassNameEnum.boldUnderline
}
