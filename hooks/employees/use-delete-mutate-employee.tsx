import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";

import { deleteEmployee } from "../../api";
import { IUserEntity } from "../../types/user.entity";
import { queryClient } from "../../providers/with-react-query/with-react-query";

export default function useDeleteMutateEmployee() {
    return useMutation<IUserEntity, Error, number | string>(
        {
            mutationKey: ["delete-employee"],
            mutationFn: async (id) => {
                try {
                    const res = (await deleteEmployee(id));
                    await queryClient.refetchQueries({ queryKey: ['get-employees'] });
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            },
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Успішно видалено!',
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