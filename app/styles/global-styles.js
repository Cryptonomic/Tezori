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
  }

  div#root {
    height: 100vh;
  }  

  // Animation
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .slideDownFadeIn {
    opacity: 0;
    transform: translate3d(0, -100px, 0);
    animation: slideDownFadeIn 1s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }

  @keyframes slideDownFadeIn {
    0% {
      opacity: 0;
      transform: translate3d(0, -100px, 0);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  .slideUpFadeIn {
    opacity: 0;
    transform: translate3d(0, 100px, 0);
    animation: slideUpFadeIn 1s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  }

  @keyframes slideUpFadeIn {
    0% {
      opacity: 0;
      transform: translate3d(0, 100px, 0);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @media screen and (min-width: 595px) {

    .slideUp {
      display: block;
      transform: translate3d(0, 100px, 0);
      animation: slideUp 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
    }

    @keyframes slideUp {
      0% {
        transform: translate3d(0, 100px, 0);
      }
      100% {
        transform: translate3d(0, 0, 0);
      }
    }

  }

  @media screen and (max-width: 594px) {

    .slideUp {
      display: block;
      opacity: 0;
      animation: fadeIn 2s forwards;
    }

  }

  @for $i from 1 through 20 {
    .delay-#{$i*100} {
      animation-delay: #{$i*0.1}s;
    }
  }

  .bg-circle_01, 
  .bg-circle_02, 
  .bg-circle_03, 
  .bg-circle_04 {
    opacity: 0;
    backface-visibility: hidden;
    animation: fadeInOut 2000ms ease-in-out infinite alternate;
  }

  .bg-circle_01 {
    animation-delay: 2000ms;
  }

  .bg-circle_02 {
    animation-delay: 2400ms;
  }

  .bg-circle_03 {
    animation-delay: 2800ms;
  }

  .bg-circle_04 {
    animation-delay: 3200ms;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate3d(-50%, 0, 0);
    }
    50% {
      opacity: 1;
      transform: translate3d(-50%, 0, 0);
    }
    100% {
      opacity: 1;
      transform: translate3d(-50%, 0, 0);
    }
  }

  // Reveal

  .reveal {
    opacity: 0;
    transform: translate3d(0, 100px, 0);
    transition: opacity 1s cubic-bezier(0.215, 0.61, 0.355, 1), transform 1s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  .reveal-show {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  .fadeIn {
    opacity: 0;
    transform: translateZ(0);
  }

  body:not(.loading) .fadeIn {
    animation: fadeIn 3s forwards;
  }

  .bg-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
  }

  .bg-container img {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    height: 100vh;
    overflow-x: hidden;
  }

  .bg-container .bg {
    z-index: 0;
  }

  .bg-container .bg-circle {
    z-index: 1;
  }

  .bg-container .bg-circles_small {
    z-index: 2;
  }
`;
