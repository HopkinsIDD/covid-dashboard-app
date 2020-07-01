/**
 * @deprecated Use colors.red instead
 */
export const red = '#d31d30';
/**
 * @deprecated Use colors.green instead
 */
export const green = '#4ddaba';
/**
 * @deprecated Use colors.gray instead
 */
export const gray = '#9b9b9b';

export const colors = {
    red: '#d31d30',
    green: '#4ddaba',
    blue: '#1f90db',
    orange: '#ffac62',
    actual: '#4d4d4d',
    gray: '#9b9b9b',
    lightGray: '#d0d0d0',
    graphBkgd: '#fcfcfc',
    chartBkgd: '#f0f2f5',
    sliderBlue: '#1890ff', //'#3885fa',

    // Names below are pulled from https://www.colorhexa.com. Duplicates are incremented
    verySoftCyan: '#b6f5e7',
    darkCyan: '#19b18e',
    lightGrayishCyan: '#e0fdf7',
    darkCyan2: '#008769',
    verySoftCyan2: '#acdacf',
    lightGrayishBlue: '#deebf7',
    lightGrayisLimeGreen: '#e5f5e0',
    lightGrayishOrange: '#fee6ce',
    lightGrayishOrange2: '#fee0d2',
    brightBlue: '#3885fa',
    vividOrange: '#e6550d',
    brightRed: '#de2d26',
}

export const scenarioColorPalette = [
    colors.green, colors.verySoftCyan, colors.darkCyan,
    colors.lightGrayishCyan, colors.darkCyan, colors.verySoftCyan2
]

export const mapLowColorPalette = {
    1: colors.lightGrayishBlue,
    2: colors.lightGrayisLimeGreen,
    3: colors.lightGrayishOrange,
    4: colors.lightGrayishOrange2
}

export const mapHighColorPalette = {
    1: colors.brightBlue,
    2: colors.darkCyan2,
    3: colors.vividOrange,
    4: colors.brightRed
}

export default colors;
