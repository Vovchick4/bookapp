import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";

import { getTrialVersion } from "../api";
import { queryClient } from "../providers/with-react-query/with-react-query";

export default function useTrialVersionMutate() {
    return useMutation<string, Error>(
        {
            mutationKey: ["trial-version"],
            mutationFn: async () => {
                try {
                    const res = (await getTrialVersion());
                    await queryClient.refetchQueries({ queryKey: ['get-user'] });
                    return res
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            },
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Успішна активація!',
                    text2: 'Пробна версія активована👋.'
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