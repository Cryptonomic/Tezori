import { injectGlobal } from 'styled-components';
import { Theme } from './theme'
import {ms} from './helpers'
import { normalize, darken } from 'polished';
import RobotoFontLight from '../../resources/fonts/Roboto/Roboto-Light.ttf'
import RobotoFontMedium from '../../resources/fonts/Roboto/Roboto-Medium.ttf'
import RobotoFontRegular from '../../resources/fonts/Roboto/Roboto-Regular.ttf'
import TezosIconsFontTTF from '../../resources/fonts/TezosIcons/Tezos-icons.ttf'

injectGlobal`  
  ${normalize()}
  @font-face {
  font-family: 'Roboto';
  src: url(${RobotoFontLight}) format("truetype");
  font-weight: 300;
}

@font-face {
  font-family: 'Roboto';
  src: url(${RobotoFontMedium}) format("truetype");
  font-weight: 500;
}

@font-face {
  font-family: 'Roboto';
  src: url(${RobotoFontRegular}) format("truetype");
  font-weight: normal;
}

@font-face {
  font-family: 'Tezos-icons';
  src: url(${TezosIconsFontTTF}) format('truetype');
  font-weight: normal;
  font-style: normal;
}

@import "~font-awesome/css/font-awesome.css";
  
  html {
    box-sizing: border-box;
    line-height: 1.618;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  
  html,
  body {
    width: 100%;
  }

  body {
    min-height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    -webkit-app-region: no-drag;
  }

  button {
    -webkit-app-region: no-drag;
  }
  
  div#root {
    height: 100vh;
  }  
`;
