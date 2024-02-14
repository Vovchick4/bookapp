import Collapsible from "react-native-collapsible";
import { CalendarList } from "react-native-calendars";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import * as ScreenOrientation from 'expo-screen-orientation';
import { ActivityIndicator, Button, FAB, Modal, Portal, RadioButton, Text } from "react-native-paper";
import { StyleSheet, View, SafeAreaView, Dimensions, Alert, ScrollView } from "react-native";

import { EventStatus } from "../types/event.entity";
import useChangePosBookMutate from "../hooks/use-change-pos-book-mutate";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import { ECalendarViewType, TSatusColors, useCalendar } from "../contexts/calendar";

const WeekCalendar = lazy(() => import('../components/week-calendar'))

const Modal_States = {
    fab: "fab",
    filter: "filter",
}

export default function Home({ navigation: { navigate } }: any) {
    const { colors } = useAppTheme();
    const [date, setDate] = useState<Date>(new Date());
    const [isModalState, setIsModalState] = useState<string | null>(null);

    const isFocused = useIsFocused();
    const { queryRoom: { data, isLoading, isRefetching }, calendarViewType, isVisibleFullCalendar, activeBookId, changeActiveBookId } = useCalendar();
    const { mutate: mutateBookPos, isPending: changingBookPos } = useChangePosBookMutate();

    const { height: screenHeight } = Dimensions.get('window');
    const halfScreenHeight = screenHeight / 2;

    const statusesColors = useMemo<TSatusColors>(() => ({
        [EventStatus.fullpaid]: colors.statusPaid,
        [EventStatus.deposit]: colors.statusDeposit,
        [EventStatus.nopaid]: colors.statusNoPaid,
        [EventStatus.canceled]: colors.statusCanceled,
    }), [])

    useFocusEffect(
        useCallback(() => {
            if (calendarViewType === ECalendarViewType.month) {
                (async () => {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
                })();
            }

            return async () => {
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
            }
        }, [calendarViewType])
    )

    const onStateChange = () => setIsModalState(prev => prev === Modal_States.fab ? null : Modal_States.fab);

    return (
        <SafeAreaView style={styles.safe}>
            <Collapsible collapsed={!isVisibleFullCalendar}>
                <View style={{ paddingLeft: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ maxHeight: halfScreenHeight }}>
                        <CalendarList
                            // Configure your calendar props here
                            // For instance:
                            horizontal={calendarViewType === ECalendarViewType.week}
                            monthFormat={'MMMM yyyy'}
                            hideExtraDays={true}
                            firstDay={4}
                            current={date.toString()}
                            theme={{
                                calendarBackground: colors.surface,
                                textSectionTitleColor: 'black',
                                todayTextColor: colors.surface,
                                todayBackgroundColor: 'green',
                                dayTextColor: 'black',
                                arrowColor: 'red',
                                selectedDayTextColor: colors.surface,
                                selectedDayBackgroundColor: colors.menuColor,
                                // Add more custom styles as needed
                            }}
                            // Handle onDayPress or other calendar callbacks as needed
                            onDayPress={(day) => setDate(new Date(day.dateString))}
                        />
                    </View>
                </View>
            </Collapsible>

            <Suspense fallback={<ActivityIndicator animating={true} color={colors.menuColor} />}>
                <WeekCalendar
                    date={date}
                    rooms={data}
                    navigate={navigate}
                    isLoadingRooms={(isLoading || isRefetching)}
                    statusesColors={statusesColors}
                    onOpenFilter={() => setIsModalState(Modal_States.filter)}
                />
            </Suspense>

            {!isLoading && data && data.length > 0 && (
                <Portal>
                    <Modal visible={!!activeBookId?.roomId} onDismiss={() => changeActiveBookId(() => ({ roomId: "", bookId: "" }))} contentContainerStyle={{ maxHeight: 300, backgroundColor: 'white', padding: 20, paddingBottom: 5 }}>
                        <ScrollView style={{ marginBottom: 10 }}>
                            <RadioButton.Group onValueChange={newValue => changeActiveBookId(prev => ({ ...prev, roomId: newValue }))} value={String(activeBookId?.roomId)}>
                                {data.map(({ id, name }, index) => (
                                    <RadioButton.Item key={id} label={name} color={colors.orangeColor} value={id.toString()} />
                                ))}
                            </RadioButton.Group>
                        </ScrollView>
                        <Button
                            loading={changingBookPos}
                            disabled={changingBookPos}
                            mode="outlined"
                            textColor={colors.orangeColor}
                            rippleColor={colors.orangeColor}
                            onPress={() => {
                                if (
                                    activeBookId?.bookId !== undefined &&
                                    activeBookId?.roomId !== undefined
                                ) {
                                    //@ts-ignore
                                    mutateBookPos(activeBookId);
                                    changeActiveBookId(() => ({ roomId: "", bookId: "" }));
                                }
                            }}
                        >
                            Зберигти
                        </Button>
                    </Modal>
                </Portal>
            )}

            {!isLoading && <Portal>
                <FAB.Group
                    open={isModalState === Modal_States.fab}
                    visible={isFocused && (isModalState === null || isModalState === Modal_States.fab)}
                    icon={'plus'}
                    color={colors.surface}
                    fabStyle={{ backgroundColor: colors.menuColor }}
                    actions={[
                        {
                            icon: 'plus',
                            label: 'Бронювання',
                            onPress: () => {
                                if (data && data.length > 0) {
                                    navigate('CalendarController', { room_id: -1, mode: "create", is_room_vis: true, type: "event" })
                                } else {
                                    Alert.alert(
                                        'Немає помешкань',
                                        'Спочатку добавте помешкання',
                                        [
                                            {
                                                text: 'OK', // Button text
                                            },
                                        ],
                                    )
                                }
                            },
                        },
                        {
                            icon: 'bed',
                            label: 'Додати помещкання',
                            onPress: () => navigate('CalendarController', { mode: "create", type: "room" }),
                        }
                    ]}
                    onStateChange={onStateChange}
                />
            </Portal>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%', // Set the width to 100% for full width
        backgroundColor: 'white',
    },
});

