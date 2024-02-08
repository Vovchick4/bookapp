import { useQuery } from "@tanstack/react-query";
import { getSources } from "../api";
import { ISources } from "../types/event.entity";

export default function useGetMutateSources() {
    return useQuery<{ label: string, value: string }[]>({
        queryKey: ['get-sources'],
        queryFn: async () => {
            try {
                const res = (await getSources()).data as ISources[];
                if (res && res?.length > 0) {
                    return [...res.map((({ id, name }) => ({ value: id, label: name })))];
                } else {
                    return []
                }
            } catch (error) {
                throw (error as any).response?.data || { message: 'An error occurred' };
            }
        },
        refetchOnWindowFocus: true,
    })
}
