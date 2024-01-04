import { useMutation } from "@tanstack/react-query";

import { TCreateEventPayload } from "../types/event.entity";
import { IRoomEntity, TCreateRoomPayload } from "../types/room.entity";
import { queryClient } from "../providers/with-react-query/with-react-query";
import { createEvent, createRoom, deleteEvent, deleteRoom, updateEvent, updateRoom } from "../api";
import { useNavigation } from "@react-navigation/native";

export enum EQueries {
    createRoom = "createRoom",
    createEvent = "createEvent",
    updateRoom = "updateRoom",
    updateEvent = "updateEvent",
    deleteRoom = "deleteRoom",
    deleteEvent = "deleteEvent"
}

const queries = {
    [EQueries.createRoom]: async (data: TCreateRoomPayload) => await createRoom(data),
    [EQueries.createEvent]: async (data: TCreateEventPayload) => await createEvent(data),
    [EQueries.updateRoom]: async ({ id, ...data }: { data: TCreateRoomPayload, id: number | string }) => await updateRoom(data, id),
    [EQueries.updateEvent]: async ({ id, ...data }: { data: TCreateEventPayload, id: number | string }) => await updateEvent(data, id),
    [EQueries.deleteRoom]: async ({ id }: { id: number | string }) => await deleteRoom(id),
    [EQueries.deleteEvent]: async ({ id }: { id: number | string }) => await deleteEvent(id),
}

export default function useCalendarMutate({ id }: { id: number }) {
    const navigation = useNavigation();

    return useMutation<any, Error, { mode: EQueries, data: any }>(
        {
            mutationKey: ["calendar-mutates"],
            mutationFn: async ({ mode, data }) => {
                try {
                    //console.log({ ...data, id: id === -1 ? undefined : id });
                    const res = await queries[mode]({ ...data, id: id === -1 ? undefined : id });
                    await queryClient.refetchQueries({ queryKey: ['get-rooms'] });
                    navigation.goBack();
                    return res.data;
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' };
                }
            }
        }
    );
}