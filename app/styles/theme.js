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

    // Gray colors
    gray0: '#191414',
    gray1: '#f7f9fb',
    gray2: '#edf0f7',
    gray3: '#5571a7',
    gray4: '#fcfcfc',
    gray5: '#9b9b9b',

    // font colors
    index0: '#94a9d1',

    // black colors
    black1: '#1e1313',

    // check colors
    check: '#259c90'
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
      light: 300,
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
