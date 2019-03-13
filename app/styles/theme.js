export const Theme = {
  colors: {
    // Basic colors
    primary: '#123262',
    secondary: '#7691c4',
    accent: '#2c7df7',
    light: '#FAFBFB',
    disabled: '#C8D0D3',
    transparent: 'transparent',

    // State colors
    error: '#F22121',
    success: '#18CE7E',

    // Regular colors
    white: '#FFFFFF',
    blue1: '#2c7df7',
    blue2: '#0099dc',
    blue3: '#4486f0',
    blue4: '#00cec4',
    blue5: '#7189B7',

    // Gray colors
    gray0: '#191414',
    gray1: '#f7f9fb',
    gray2: '#edf0f7',
    gray3: '#5571a7',
    gray4: '#fcfcfc',
    gray5: '#9b9b9b',
    gray6: '#99a5b9',
    gray7: '#e2e7f2',
    gray8: '#cfcece',
    gray9: '#b5c5e3',
    gray10: '#979797',
    gray11: '#d4ddf0',
    gray12: '#c8c6c6',
    gray13: '#d8e4fc',
    gray14: '#F0F3F8',
    gray15: '#9E9E9E',

    // font colors
    index0: '#94a9d1',
    index1: 'rgba(148, 169, 209, 0.57)', // Same as index0 but with 57% transparency

    // black colors
    black1: '#1e1313',
    black2: '#4a4a4a',

    // check colors
    check: '#259c90',

    // error colors
    error1: '#ea776c',

    // info color
    info: '#c8d2e7'
  },
  animations: {
    defaultTime: '300ms',
    secondaryTime: '450ms'
  },
  animationCurves: {
    defaultCurve: 'cubic-bezier(0.23, 1, 0.32, 1) '
  },
  typo: {
    fontFamily: {
      primary: "'Roboto', sans-serif",
      tezosIcons: "'Tezos-icons'"
    },
    weights: {
      light: 100,
      normal: 400,
      bold: 500
    }
  },
  layers: {
    top: 1000,
    middle: 900,
    bottom: 800
  }
};

export default Theme;
