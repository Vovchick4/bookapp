import { useQuery } from "@tanstack/react-query";
import { getSources } from "../api";
import { ISources } from "../types/event.entity";

export default function useGetMutateSources() {
    return useQuery<ISources[]>({
        queryKey: ['get-sources'],
        queryFn: async () => {
            try {
                console.log((await getSources()));

                return (await getSources()).data;
            } catch (error) {
                console.log("🚀 ~ queryFn: ~ error:", error)

                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        refetchOnWindowFocus: true,
    })
}
