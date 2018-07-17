/* eslint no-unused-expressions: 0 */

import { injectGlobal } from "styled-components";
import { normalize } from "polished";

import RobotoFontThin from "../../resources/fonts/Roboto/Roboto-Thin.ttf";
import RobotoFontThinItalic from "../../resources/fonts/Roboto/Roboto-ThinItalic.ttf";
import RobotoFontLight from "../../resources/fonts/Roboto/Roboto-Light.ttf";
import RobotoFontLightItalic from "../../resources/fonts/Roboto/Roboto-LightItalic.ttf";
import RobotoFontMedium from "../../resources/fonts/Roboto/Roboto-Medium.ttf";
import RobotoFontMediumItalic from "../../resources/fonts/Roboto/Roboto-MediumItalic.ttf";
import RobotoFontRegular from "../../resources/fonts/Roboto/Roboto-Regular.ttf";
import RobotoFontRegularItalic from "../../resources/fonts/Roboto/Roboto-Italic.ttf";
import RobotoFontBold from "../../resources/fonts/Roboto/Roboto-Bold.ttf";
import RobotoFontBoldItalic from "../../resources/fonts/Roboto/Roboto-BoldItalic.ttf";
import RobotoFontBlack from "../../resources/fonts/Roboto/Roboto-Black.ttf";
import RobotoFontBlackItalic from "../../resources/fonts/Roboto/Roboto-BlackItalic.ttf";
import RobotoCondensedFontLight from "../../resources/fonts/Roboto/RobotoCondensed-Light.ttf"
import RobotoCondensedFontLightItalic from "../../resources/fonts/Roboto/RobotoCondensed-LightItalic.ttf"
import RobotoCondensedFontRegular from "../../resources/fonts/Roboto/RobotoCondensed-Regular.ttf"
import RobotoCondensedFontRegularItalic from "../../resources/fonts/Roboto/RobotoCondensed-Italic.ttf"
import RobotoCondensedFontBold from "../../resources/fonts/Roboto/RobotoCondensed-Bold.ttf"
import RobotoCondensedFontBoldItalic from "../../resources/fonts/Roboto/RobotoCondensed-BoldItalic.ttf"
import TezosIconsFontTTF from "../../resources/fonts/TezosIcons/Tezos-icons.ttf";
import fontAwesome from '../../node_modules/font-awesome/css/font-awesome.css';


injectGlobal`
  ${normalize()}

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontThin}) format("truetype");
    font-weight: 100;
    font-style: normal;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontThinItalic}) format("truetype");
    font-weight: 100;
    font-style: italic;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontLight}) format("truetype");
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontLightItalic}) format("truetype");
    font-weight: 300;
    font-style: italic;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontRegular}) format("truetype");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontRegularItalic}) format("truetype");
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontMedium}) format("truetype");
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontMediumItalic}) format("truetype");
    font-weight: 500;
    font-style: italic;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontBold}) format("truetype");
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontBoldItalic}) format("truetype");
    font-weight: 700;
    font-style: italic;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontBlack}) format("truetype");
    font-weight: 900;
    font-style: normal;
  }

  @font-face {
    font-family: 'Roboto';
    src: url(${RobotoFontBlackItalic}) format("truetype");
    font-weight: 900;
    font-style: italic;
  }

  @font-face {
    font-family: 'RobotoCondensed';
    src: url(${RobotoCondensedFontLight}) format("truetype");
    font-weight: 300;
    font-style: normal;
  }

  @font-face {
    font-family: 'RobotoCondensed';
    src: url(${RobotoCondensedFontLightItalic}) format("truetype");
    font-weight: 300;
    font-style: italic;
  }

  @font-face {
    font-family: 'RobotoCondensed';
    src: url(${RobotoCondensedFontRegular}) format("truetype");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: 'RobotoCondensed';
    src: url(${RobotoCondensedFontRegularItalic}) format("truetype");
    font-weight: 400;
    font-style: italic;
  }

  @font-face {
    font-family: 'RobotoCondensed';
    src: url(${RobotoCondensedFontBold}) format("truetype");
    font-weight: 700;
    font-style: normal;
  }

  @font-face {
    font-family: 'RobotoCondensed';
    src: url(${RobotoCondensedFontBoldItalic}) format("truetype");
    font-weight: 700;
    font-style: italic;
  }

  @font-face {
    font-family: 'Tezos-icons';
    src: url(${TezosIconsFontTTF}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @import ${fontAwesome};
  
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
    background-color: #edf0f7;
  }

  div#root {
    height: 100vh;
    max-width: 1440px;
    margin: 0 auto;
  }  

`;
