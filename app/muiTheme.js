import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  overrides: {
    MuiSnackbarContent: {
      root: {
        minWidth: '500px',
        maxWidth: '1000px',
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
