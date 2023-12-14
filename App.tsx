import axios from 'axios';
import { NavigationContainer } from '@react-navigation/native';

import { Splash } from './components';
import withProviders from './providers';
import { useAuth } from './contexts/auth';
import { AuthLayout, DefaultLayout } from './layouts';
import useGetQueryUser from './hooks/use-get-query-user';

import type { UserEntity } from './types/user.entity';

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

  const { error, isLoading } = useGetQueryUser();

  if (isLoading) {
    return <Splash />
  }

  return (
    <AppContent user={user} />
  );
}

export default withProviders(App)


