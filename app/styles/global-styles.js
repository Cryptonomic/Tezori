import { injectGlobal } from 'styled-components';
import { Theme } from './theme'
import {ms} from './helpers'
import { normalize, darken } from 'polished';
import RobotoFont from '../../resources/fonts/Roboto/Roboto-Light.ttf'
import TezosIconsFontTTF from '../../resources/fonts/TezosIcons/Tezos-icons.ttf'

injectGlobal`  
  ${normalize()}
  @font-face {
  font-family: 'Roboto';
  src: url(${RobotoFont});
  font-weight: 300;
}

@font-face {
  font-family: 'Roboto';
  src: url(${RobotoFont});
  font-weight: 500;
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
  
  
   //ToolTip Tezos theme
.tippy-popper .tippy-tooltip.tezos-theme{
    max-width: ${ms(16)};
    border-radius: 5px;
    border: 1px solid ${Theme.colors.white};
    box-shadow: 0 3px ${ms(3)} -1px ${darken(0.5, Theme.colors.white)};
    background-color: ${Theme.colors.white};
    padding: ${ms(-2)};
    font-size: ${ms(-1)};
    color: ${Theme.colors.primary};
}
.tippy-popper .tippy-tooltip.graupel-theme[data-animatefill]{
    background-color:transparent
}

.tippy-popper[x-placement^=top] .tippy-tooltip.graupel-theme [x-circle]{
    background-color: ${Theme.colors.white}
}
.tippy-popper[x-placement^=top] .tippy-tooltip.graupel-theme [x-arrow]{
    border-top:7px solid ${Theme.colors.white};
    border-right:7px solid transparent;
    border-left:7px solid transparent
}
.tippy-popper[x-placement^=top] .tippy-tooltip.graupel-theme [x-arrow].arrow-small{
    border-top:5px solid ${Theme.colors.white};
    border-right:5px solid transparent;
    border-left:5px solid transparent
}
.tippy-popper[x-placement^=top] .tippy-tooltip.graupel-theme [x-arrow].arrow-big{
    border-top:10px solid ${Theme.colors.white};
    border-right:10px solid transparent;
    border-left:10px solid transparent
}

.tippy-popper[x-placement^=bottom] .tippy-tooltip.graupel-theme [x-circle]{
    background-color: ${Theme.colors.white}
}
.tippy-popper[x-placement^=bottom] .tippy-tooltip.graupel-theme [x-arrow]{
    border-bottom:7px solid ${Theme.colors.white};
    border-right:7px solid transparent;
    border-left:7px solid transparent
}

.tippy-popper[x-placement^=bottom] .tippy-tooltip.graupel-theme [x-arrow].arrow-big{
    top: -20px;
    border-bottom: 21px solid ${Theme.colors.white};
    border-right: 21px solid transparent;
    border-left: 21px solid transparent;
    &::after {
        content: '';
        border-bottom: 22px solid  ${Theme.colors.white};
        border-right: 22px solid transparent;
        border-left: 22px solid transparent;
        display: block;
        position: absolute;
        right: -22px;
        bottom: -20px;
        z-index: -1;
    }
}
`;
