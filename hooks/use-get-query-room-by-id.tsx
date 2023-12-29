import { useQuery } from "@tanstack/react-query";
import { getRoomById } from "../api";

export default function useGetQueryRoomById({ roomId, mode }: { roomId: number | string, mode: string }) {
    return useQuery({
        queryKey: ["get-room-by-id", roomId],
        queryFn: async () => {
            try {
                return (await getRoomById(roomId)).data;
            } catch (error) {
                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        enabled: mode === 'update' && roomId !== -1,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
    });
}
