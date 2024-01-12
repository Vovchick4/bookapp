import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";

import { changePassUser } from "../api";
import { IUserEntity } from "../types/user.entity";

export default function useUserChangePassMutate({ onSuccess }: { onSuccess: () => void }) {
    return useMutation<IUserEntity, Error, { password: string, new_password: string }>(
        {
            mutationKey: ["change-pass-user"],
            mutationFn: async (data) => {
                try {
                    const res = (await changePassUser(data));
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            },
            onSuccess: () => {
                onSuccess();
                Toast.show({
                    type: 'success',
                    text1: 'Успішно оновлено!',
                    text2: 'Ваш пароль було змінено👋.'
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
