import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { createSource } from "../api";
import { ISources } from "../types/event.entity";
import { queryClient } from "../providers/with-react-query/with-react-query";

export default function useCreateSourceMutate() {
    return useMutation<ISources, Error, { name: string }>(
        {
            mutationKey: ["createCompany"],
            mutationFn: async (data) => {
                try {
                    const res = (await createSource(data));
                    await queryClient.refetchQueries({ queryKey: ['get-sources'] });
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            },
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Успішно додано!',
                });
            },
            onError: (error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Помилка!',
                    text2: error.message
                });
            }
        }
    );
}
