import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api';
import { useAuth } from '../contexts/auth';

export default function useGetQueryUser(oQueriesOpts = {}) {
    const { user, fillUser: fiillUser, signOut } = useAuth();

    return useQuery(
        {
            queryKey: ["getUser"],
            queryFn: async () => {
                try {
                    // Handle successful data retrieval here
                    const data = await getUser();
                    fiillUser(data);
                    return data;
                } catch (error) {
                    // Handle error if getUser() fails
                    signOut();
                    throw error;
                }
            },
            enabled: !!user,
            ...oQueriesOpts
        }
    );
}