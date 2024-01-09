import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "../../api";
import { IUserEntity } from "../../types/user.entity";

export default function useGetQueryEmployees() {
    return useQuery<IUserEntity[]>({
        queryKey: ['get-employees'],
        queryFn: async () => {
            try {
                return (await getEmployees()).data;
            } catch (error) {
                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        refetchOnWindowFocus: true,
    })
}