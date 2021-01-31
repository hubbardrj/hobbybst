import React, { useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Snackbar } from '@material-ui/core';

const SnackBarContext = React.createContext();
const AUTO_DISMISS = 5000;

export function useSnackBars() {
    const context = useContext(SnackBarContext);
    if (context === undefined) {
        throw new Error("useSnackBars must be used within a Snackbar Provider");
    }
    return context;
}

export function SnackBarProvider({ children }) {
    const [alerts, setAlerts] = useState([]);
  
    const activeAlertIds = alerts.join(',');
    useEffect(() => {
      if (activeAlertIds.length > 0) {
        const timer = setTimeout(() => setAlerts((alerts) => alerts.slice(0, alerts.length - 1)), AUTO_DISMISS)
        return () => clearTimeout(timer)
      }
    }, [activeAlertIds]);

    const addAlert = useCallback((content) => setAlerts((alerts) => [content, ...alerts]), []);

    const value = useMemo(() => ({ addAlert }), [addAlert]);

  return (
    <SnackBarContext.Provider value={value}>
      {children}
      {alerts.map((alert) => 
        <Snackbar 
            open={true} 
            key={alert} 
            anchorOrigin={{ vertical:'bottom', horizontal:'right' }}
        >
            {alert}
        </Snackbar>)}
    </SnackBarContext.Provider>
  )
}

