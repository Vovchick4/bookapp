import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../api";

export default function useGetQueryEventById({ bookId, mode }: { bookId: number | string, mode: string }) {
    return useQuery({
        queryKey: ["get-book-by-id", bookId],
        queryFn: async () => {
            try {
                return (await getBookById(bookId)).data;
            } catch (error) {
                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        enabled: mode === 'update' && bookId !== undefined,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
    })
}
