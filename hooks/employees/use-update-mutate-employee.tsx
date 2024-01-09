import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";

import { updateEmployee } from "../../api";
import { IUserEntity, TEmployeeCreatePayload } from "../../types/user.entity";
import { queryClient } from "../../providers/with-react-query/with-react-query";

export default function useUpdateMutateEmployee({ onSuccess }: { onSuccess: () => void; }) {
    return useMutation<IUserEntity, Error, { data: TEmployeeCreatePayload, id: number | string }>(
        {
            mutationKey: ["update-employee"],
            mutationFn: async ({ data, id }) => {
                try {
                    const res = (await updateEmployee(data, id));
                    await queryClient.refetchQueries({ queryKey: ['get-employees'] });
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
                    text2: 'Оновлено дані працівника 👋'
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