import { injectGlobal } from 'styled-components'
import { normalize } from 'polished'

injectGlobal`  
  ${normalize()}
  
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
`
