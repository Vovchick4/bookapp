import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { getUser } from '../api';
import { useAuth } from '../contexts/auth';
import { queryClient } from '../providers/with-react-query/with-react-query';

export default function useGetQueryUser() {
    const { user, fillUser: fillUser, signOut } = useAuth();

    return useQuery({
        queryKey: ["get-user"],
        queryFn: async () => {
            try {
                //const remember_token = await SecureStore.getItemAsync('token');
                if (user?.remember_token) {
                    axios.defaults.headers.authorization = `${user.remember_token}`;
                    // If token exists, execute the getUser() function to fetch user data
                    const res = await getUser();
                    console.log(res.data);
                    fillUser(res.data);
                    await queryClient.refetchQueries({ queryKey: ['get-rooms'] });
                    return res.data;
                } else {
                    throw new Error("Logout");
                }
            } catch (error) {
                // Handle error if getUser() fails
                await signOut();
                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        enabled: !!user, // Enable the query based on token existence
        refetchOnWindowFocus: false
    });
}