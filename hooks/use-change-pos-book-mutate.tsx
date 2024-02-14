import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { changePositionBook } from "../api";
import { IEventEntity } from "../types/event.entity";
import { queryClient } from "../providers/with-react-query/with-react-query";

export default function useChangePosBookMutate() {
    return useMutation<IEventEntity, Error, { roomId: number | string, bookId: number | string }>(
        {
            mutationKey: ["change-pos-book-room"],
            mutationFn: async (data) => {
                try {
                    const res = (await changePositionBook(data)).data;
                    await queryClient.refetchQueries({ queryKey: ['get-rooms'] });
                    return res;
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            },
            onSuccess: () => {
                Toast.show({
                    type: 'success',
                    text1: 'Успішно змінено!',
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
