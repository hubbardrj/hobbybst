import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: colors.cyan[800]
    },
    secondary: {
      main: colors.blueGrey[600]
    },
    cancel: {
      main: colors.red[500]
    },
    text: {
      primary: colors.blueGrey[800],
      secondary: colors.blueGrey[600]
    }
  },
  shadows,
  typography
});

export default theme;
