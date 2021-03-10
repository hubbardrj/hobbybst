import 'react-perfect-scrollbar/dist/css/styles.css';
import React from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import AppRoutes from 'src/appRoutes';
import { useAuthState} from "./contexts/Auth";
import { SnackBarProvider } from './contexts/Snackbar/SnackbarContext';

const App = () => {
  const location = useLocation();
  const userDetails = useAuthState();
  //const routing = useRoutes(routes(userDetails.isLoggedin, location));  
  const routing = useRoutes(AppRoutes(location));  

  if (userDetails.loading)
  {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyles />
      </ThemeProvider>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <SnackBarProvider>
        {routing}
      </SnackBarProvider>
    </ThemeProvider>
  );
};

export default App;
