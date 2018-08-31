import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  overrides: {
    MuiSnackbarContent: {
      root: {
        minWidth: '500px !important',
        maxWidth: '1000px !important',
        width: '100%',
        padding: 0
      },
      message: {
        padding: 0,
        width: '100%'
      }
    }
  }
  
});
