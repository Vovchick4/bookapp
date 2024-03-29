import { ScrollView, View } from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";

import { EventForm, RoomForm } from "../components";
import useGetQueryRoomById from "../hooks/use-get-query-room-by-id";
import useCalendarMutate, { EQueries } from "../hooks/use-calendar-mutate";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

export default function CalendarController({ route: { params } }: any) {
    const { colors } = useAppTheme();
    const { reset, mutate, error, isPending } = useCalendarMutate({ id: params.type === 'event' ? params.bookId || -1 : params.room_id || -1 });
    const { data: room, isLoading: isLoadingRoom } = useGetQueryRoomById({ roomId: params.room_id || -1, mode: params.mode });

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {(!isLoadingRoom) && (
                    params.type === "event" ? (
                        <EventForm
                            mode={params.mode}
                            bookId={params.bookId || undefined}
                            is_room_vis={params.is_room_vis}
                            roomName={params.roomName}
                            start_date={params.start_date || undefined}
                            room_id={params.room_id || -1}
                            eventData={params.eventData || {}}
                            onSubmit={(data) => {
                                mutate({ mode: params.mode === 'create' ? EQueries.createEvent : EQueries.updateEvent, data });
                            }}
                            deleteEvent={() => mutate({ mode: EQueries.deleteEvent, data: undefined })}
                        />
                    ) : (
                        <RoomForm
                            mode={params.mode}
                            roomId={params.room_id || -1}
                            roomData={room}
                            rooms={params.rooms || {}}
                            onSubmit={(data) => {
                                mutate({ mode: params.mode === 'create' ? EQueries.createRoom : EQueries.updateRoom, data });
                            }}
                            deleteRoom={() => mutate({ mode: EQueries.deleteRoom, data: undefined })}
                        />
                    )
                )}
            </ScrollView>
            {(isPending || isLoadingRoom) && (
                <ActivityIndicator
                    style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 9999, backgroundColor: colors.onSurface, opacity: 0.2 }}
                    size="large"
                    color="#0000ff"
                    animating={true}
                />
            )}
            <Snackbar
                visible={!!error}
                onDismiss={reset}
                action={{
                    label: 'Скасувати',
                }}
                style={{ backgroundColor: colors.error }}
            >
                {error ? error.message || 'An error occurred' : ''}
            </Snackbar>
        </View>
    )
}
