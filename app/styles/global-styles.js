import { injectGlobal } from 'styled-components'
import { normalize } from 'polished'

injectGlobal`  
  ${normalize()}
  
    @font-face {
  font-family: 'Roboto';
  src: url('../resources/fonts/Roboto/Roboto-Light.ttf');
  font-weight: 300;
}

@font-face {
  font-family: 'Roboto';
  src: url('../resources/fonts/Roboto/Roboto-Medium.ttf');
  font-weight: 500;
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
`
