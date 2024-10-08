import Collapsible from "react-native-collapsible";
import { CalendarList } from "react-native-calendars";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import * as ScreenOrientation from 'expo-screen-orientation';
import { ActivityIndicator, Button, FAB, Modal, Portal, RadioButton, Text } from "react-native-paper";
import { StyleSheet, View, SafeAreaView, Dimensions, Alert, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { EventStatus } from "../types/event.entity";
import useChangePosBookMutate from "../hooks/use-change-pos-book-mutate";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import { ECalendarViewType, TSatusColors, useCalendar } from "../contexts/calendar";

const WeekCalendar = lazy(() => import('../components/week-calendar'))

const Modal_States = {
    fab: "fab",
    filter: "filter",
}

const ITEMS_PER_PAGE = 40;

export default function Home({ navigation: { navigate } }: any) {
    const { colors } = useAppTheme();
    const [date, setDate] = useState<Date>(new Date());
    const [isModalState, setIsModalState] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1); // Стан для відстеження поточної сторінки

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

    const paginatedData = useMemo(() => {
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE;
        return data ? data.slice(startIdx, endIdx) : [];
    }, [data, currentPage]);

    const handleNextPage = () => {
        if (data && currentPage < Math.ceil(data.length / ITEMS_PER_PAGE)) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const markedDates = useMemo(() => {
        const markings: any = {};
        if (paginatedData) {
            paginatedData.forEach(room => {
                if (room.bookings) {
                    room.bookings.forEach((booking: any) => {
                        markings[booking.date] = {
                            marked: true,
                            dotColor: colors.orangeColor,
                            customStyles: {
                                container: {
                                    backgroundColor: colors.surface,
                                },
                                text: {
                                    color: 'black',
                                    fontWeight: 'bold',
                                }
                            }
                        };
                    });
                }
            });
        }
        return markings;
    }, [paginatedData, colors]);

    return (
        <SafeAreaView style={styles.safe}>
            <Collapsible collapsed={!isVisibleFullCalendar}>
                <View style={{ paddingLeft: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ maxHeight: halfScreenHeight }}>
                        <CalendarList
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
                            }}
                            markedDates={markedDates}
                            onDayPress={(day) => setDate(new Date(day.dateString))}
                        />
                    </View>
                </View>
            </Collapsible>

            <Suspense fallback={<ActivityIndicator animating={true} color={colors.menuColor} />}>
                <WeekCalendar
                    date={date}
                    rooms={paginatedData}
                    navigate={navigate}
                    isLoadingRooms={(isLoading || isRefetching)}
                    statusesColors={statusesColors}
                    onOpenFilter={() => setIsModalState(Modal_States.filter)}
                />
            </Suspense>

            <View style={styles.paginationContainer}>
                <TouchableOpacity disabled={currentPage === 1} onPress={handlePrevPage} style={styles.iconButton}>
                    <Ionicons name="chevron-back-outline" size={24} color={currentPage === 1 ? 'gray' : 'black'} />
                </TouchableOpacity>
                <Text>{`Сторінка ${currentPage} з ${Math.ceil((data ? data.length : 0) / ITEMS_PER_PAGE)}`}</Text>
                <TouchableOpacity disabled={data ? currentPage >= Math.ceil(data.length / ITEMS_PER_PAGE) : true} onPress={handleNextPage} style={styles.iconButton}>
                    <Ionicons name="chevron-forward-outline" size={24} color={data ? (currentPage >= Math.ceil(data.length / ITEMS_PER_PAGE) ? 'gray' : 'black') : 'gray'} />
                </TouchableOpacity>
            </View>

            <Portal>
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
                                                text: 'OK',
                                            },
                                        ],
                                    )
                                }
                            },
                        },
                        {
                            icon: 'bed',
                            label: 'Додати помешкання',
                            onPress: () => navigate('CalendarController', { mode: "create", type: "room" }),
                        }
                    ]}
                    onStateChange={onStateChange}
                />
            </Portal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    iconButton: {
        padding: 10,
    }
});