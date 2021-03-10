import React from "react";
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import CustomerListView from 'src/views/customer/CustomerListView';
import Cards from 'src/views/card/Cards';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import ProductListView from 'src/views/product/ProductListView';
import RegisterView from 'src/views/auth/RegisterView';
import SettingsView from 'src/views/settings/SettingsView';
import LandingView from './views/landing/LandingView';
import * as actions from './contexts/Auth/AuthActions';
import { useAuthState, useAuthDispatch } from './contexts/Auth'
 
const AppRoutes = (location) => {
    const dispatch = useAuthDispatch();
    const userDetails = useAuthState();

    React.useEffect(() => {
      actions.authCheckState(dispatch);
    },[location, dispatch]);

    return (
        [
            {
              path: 'app',
              element: userDetails.isLoggedin ? <DashboardLayout /> : <Navigate to="/login" replace state= {{from: location.pathname}} />,
              children: [
                { path: 'account', element: <AccountView /> },
                { path: 'customers', element: <CustomerListView /> },
                { path: 'cards/*', element: <Cards /> },
                { path: 'dashboard', element: <DashboardView /> },
                { path: 'products', element: <ProductListView /> },
                { path: 'settings', element: <SettingsView /> },
                { path: '*', element: <Navigate to="/404" /> }
              ]
            },
            {
              path: '/',
              element: <MainLayout />,
              children: [
                { path: 'login', element: <LoginView />},
                { path: 'register', element: <RegisterView /> },
                { path: '404', element: <NotFoundView /> },
                { path: '/', element: <LandingView /> },
                { path: '*', element: <Navigate to="/404" /> }
              ]
            }
          ]
    )
}
 
export default AppRoutes