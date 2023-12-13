import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Splash } from './components';
import withProviders from './providers';
import { useAuth } from './contexts/auth';
import { AuthLayout, DefaultLayout } from './layouts';

axios.defaults.baseURL = "http://app.backend.booking.wmapartments.com.ua/api";

export const Drawer = createDrawerNavigator();
export const Stack = createNativeStackNavigator();

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Splash />
  }

  return (
    <NavigationContainer>
      {!!user ? <DefaultLayout /> : <AuthLayout />}
    </NavigationContainer>
  );
}

export default withProviders(App)


