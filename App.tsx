import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Splash } from './components';
import withProviders from './providers';
import { useAuth } from './contexts/auth';
import { AuthLayout, DefaultLayout } from './layouts';
import useGetQueryUser from './hooks/use-get-query-user';

import type { UserEntity } from './types/user.entity';
import { CalendarProvider } from './contexts/calendar';

axios.defaults.baseURL = "http://app.backend.booking.wmapartments.com.ua/api";

function AppContent({ user }: { user: UserEntity | null }) {
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
    </SafeAreaProvider>
  );
}

export default withProviders(App)


