import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { resetPassUser } from "../api";

export default function useResetUserPassMutate() {
    return useMutation<{}, Error, { email: string }>(
        {
            mutationKey: ["reset-pass-user"],
            mutationFn: async (data) => {
                try {
                    const res = (await resetPassUser(data));
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            },
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Успішно відпарвлено!',
                    text2: 'На вказану почту наділсено лист👋.'
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
