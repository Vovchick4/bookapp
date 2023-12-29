import { useQuery } from "@tanstack/react-query";
import { IRoomEntity } from "../types/room.entity";
import { getRoomsNames } from "../api";

export default function useGetQueryRoomsNames({ mode }: { mode: string }) {
    return useQuery<Pick<IRoomEntity, 'id' | 'name'>[]>({
        queryKey: ['get-rooms-names'],
        queryFn: async () => {
            try {
                return (await getRoomsNames()).data;
            } catch (error) {
                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        enabled: mode === 'create',
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
    })
}
