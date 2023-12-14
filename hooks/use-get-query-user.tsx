import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

import { getUser } from '../api';
import { useAuth } from '../contexts/auth';

export default function useGetQueryUser(oQueriesOpts = {}) {
    const { user, fillUser: fillUser, signOut } = useAuth();

    return useQuery({
        queryKey: ["getUser"],
        queryFn: async () => {
            try {
                const remember_token = await SecureStore.getItemAsync('token');
                if (remember_token) {
                    axios.defaults.headers.authorization = `${remember_token}`;
                }

                console.log(axios.defaults.headers);

                if (remember_token) {
                    // If token exists, execute the getUser() function to fetch user data
                    const res = await getUser();
                    fillUser(res.data);
                    return res.data;
                } else {
                    // If token doesn't exist, return null or handle accordingly
                    return null;
                }
            } catch (error) {
                // Handle error if getUser() fails
                await signOut();
                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        enabled: true, // Enable the query based on token existence
        ...oQueriesOpts,
    });
}