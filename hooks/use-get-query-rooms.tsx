import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api";
import { IRoomEntity } from "../types/room.entity";

export default function useGetQueryRooms() {
    return useQuery<IRoomEntity[]>({
        queryKey: ['get-rooms'],
        queryFn: async () => {
            try {
                return (await getRooms()).data;
            } catch (error) {
                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        refetchOnWindowFocus: true,
    })
}