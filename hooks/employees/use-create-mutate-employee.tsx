import Toast from "react-native-toast-message"
import { useMutation } from "@tanstack/react-query";

import { createEmployee } from "../../api";
import { IUserEntity, TEmployeeCreatePayload } from "../../types/user.entity";
import { queryClient } from "../../providers/with-react-query/with-react-query";

export default function useCreateMutateEmployee({ onSuccess }: { onSuccess: () => void; }) {
    return useMutation<IUserEntity, Error, TEmployeeCreatePayload>(
        {
            mutationKey: ["create-employee"],
            mutationFn: async (data) => {
                try {
                    const res = (await createEmployee(data));
                    await queryClient.refetchQueries({ queryKey: ['get-employees'] });
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            },
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Успішно створено!',
                    text2: 'Створено нового працівника 👋'
                });
                onSuccess();
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