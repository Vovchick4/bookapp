import axios from 'axios';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';

import { Splash } from './components';
import withProviders from './providers';
import { useAuth } from './contexts/auth';
import { AuthLayout, DefaultLayout } from './layouts';
import useGetQueryUser from './hooks/use-get-query-user';

import type { IUserEntity } from './types/user.entity';
import { CalendarProvider } from './contexts/calendar';

axios.defaults.baseURL = "https://app.backend.booking.wmapartments.com.ua/api";

function AppContent({ user }: { user: IUserEntity | null }) {
  return (
    <NavigationContainer>
      {!!user ? <DefaultLayout /> : <AuthLayout />}
    </NavigationContainer>
  );
}

function App() {
  const { user } = useAuth();

  const { isLoading } = useGetQueryUser();

  if (isLoading) {
    return <Splash />
  }

  return (
    <SafeAreaProvider>
      <CalendarProvider>
        <AppContent user={user} />
      </CalendarProvider>
      <Toast autoHide visibilityTime={4000} />
    </SafeAreaProvider>
  );
}

export default withProviders(App)


