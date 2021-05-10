import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: '#11213b'
    },
    secondary: {
      main: '#fb9224', //colors.blueGrey[600]
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
// {
//   palette: {
//     type: 'dark',
//     primary: {
//       main: '#112d3b',
//     },
//     secondary: {
//       main: '#fb9224',
//     },
//     background: {
//       default: '#111111',
//       paper: '#303030',
//     },
//   },
//   shadows,
//   typography
// }

export default theme;
