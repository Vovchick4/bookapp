import { format, utcToZonedTime } from "date-fns-tz";
import { addDays, eachDayOfInterval, isEqual, isSameDay } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { NativeSyntheticEvent, Platform, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

import { IRoomEntity } from "../types/room.entity";
import { EventStatus, IEventEntity } from "../types/event.entity";
import { ActivityIndicator } from "react-native-paper";
import { TSatusColors, useCalendar } from "../contexts/calendar";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

type Props = {
    date: Date;
    navigate: any;
    isLoadingRooms: boolean;
    rooms: IRoomEntity[] | undefined;
};

const kievTimeZone = 'Europe/Kiev';

export default function WeekCalendar({ date, rooms, navigate, isLoadingRooms }: Props) {
    const { colors } = useAppTheme();
    const { onChangeInterval } = useCalendar();
    const [displayedDates, setDisplayedDates] = useState<Date[]>([]);
    const [pos, setPos] = useState(0);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const statusesColors = useMemo<TSatusColors>(() => ({
        [EventStatus.fullpaid]: colors.statusPaid,
        [EventStatus.deposit]: colors.statusDeposit,
        [EventStatus.nopaid]: colors.statusNoPaid,
        [EventStatus.canceled]: colors.statusCanceled,
    }), [])

    useEffect(() => {
        if (date) {
            const initialDates = getDatesForMonth(date); // Initial two months
            setDisplayedDates(initialDates);
            onChangeInterval(initialDates, 0);
        }
    }, [date]);

    useEffect(() => {
        if (displayedDates && displayedDates[pos + 4]) {
            onChangeInterval(displayedDates, pos); // get current date interval
        }
    }, [pos, displayedDates])

    const handleScroll = (event: NativeSyntheticEvent<any>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        // console.log("🚀 ~ file: week-calendar.tsx:35 ~ handleScroll ~ contentOffset:", contentOffset, layoutMeasurement.width, contentSize.width)

        if (contentOffset.x < 10) {
            loadPreviousData({ layoutMeasurement }); // Функція для підгрузки даних вліво
        } else if (contentOffset.x > contentSize.width - layoutMeasurement.width - 100) {
            loadNextData(); // Функція для підгрузки даних вправо
        }


        // // Визначаємо інтервал після того, як скрол зупинився з затримкою 200 мс
        // const handleStopScrolling = setTimeout(() => {
        const pageIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
        const posAfterScroll = pageIndex * (displayedDates.length / 7);
        setPos(posAfterScroll);

        //     // Підгрузка додаткових даних вліво або вправо

        // }, 200);
        // // Очищаємо таймаут при новому скролі
        // clearTimeout(handleStopScrolling);
    };

    const loadPreviousData = ({ layoutMeasurement }: any) => {
        // Логіка для підгрузки даних вліво
        // Наприклад, якщо ви хочете завантажити попередні тижні
        const newDates = getDatesForMonth(displayedDates[0], -7);

        setDisplayedDates([...newDates, ...displayedDates]);

        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: layoutMeasurement.width, animated: false });
        }
    };

    const loadNextData = () => {
        // Логіка для підгрузки даних вправо
        // Наприклад, якщо ви хочете завантажити наступні тижні
        const newDates = getDatesForMonth(displayedDates[displayedDates.length - 1], 1);

        setDisplayedDates([...displayedDates, ...newDates]);
    };

    const RenderRoomRows = ({ week }: { week: Date }) => {
        return rooms && rooms.length !== 0 && rooms.map((room, roomIndex) => {
            const endDate = addDays(week, 1);
            const events = getEventsForRoomAndDay(room, week, endDate);

            return (
                <View key={roomIndex}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple(colors.primary, false)}
                        onPress={() => navigate("CalendarController", { mode: "create", is_room_vis: false, type: "event", room_id: room.id, roomName: room.name, start_date: new Date(week) })}
                    >
                        <View style={[styles.roomRow, { width: 50 }]}>
                            <View style={[styles.roomCell, { backgroundColor: defineBgColor(room), borderRightColor: colors.menuColor }]}>
                                {events && events.length > 0 && events.map((event, eventIndex) => {
                                    // const isFirst = eventIndex === 0;
                                    // const isLast = eventIndex === events.length - 1;

                                    // // Determine border styles for first and last elements
                                    // const borderStyles: any = {};
                                    // if (isFirst) {
                                    //     borderStyles.borderLeftWidth = 1;
                                    //     borderStyles.borderLeftColor = 'transparent'; // Hide the left border
                                    //     borderStyles.borderRightWidth = 5; // Increase the right border width
                                    //     borderStyles.borderRightColor = colors.menuColor;
                                    //     borderStyles.
                                    // }
                                    // if (isLast) {
                                    //     borderStyles.borderRightWidth = 1;
                                    //     borderStyles.borderRightColor = 'transparent'; // Hide the right border
                                    //     borderStyles.borderLeftWidth = 5; // Increase the left border width
                                    //     borderStyles.borderLeftColor = colors.menuColor;
                                    // }

                                    return (
                                        <TouchableNativeFeedback
                                            key={eventIndex}
                                            background={TouchableNativeFeedback.Ripple(colors.primary, false)}
                                            onPress={() => navigate("CalendarController", { bookId: event.id, room_id: room.id, roomName: room.name, mode: "update", is_room_vis: false, type: "event" })}
                                        >
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    zIndex: 9999,
                                                    height: '100%',
                                                    width: '100%',
                                                    opacity: 1,
                                                    backgroundColor: colors.menuColor
                                                    // borderRightWidth: 1,
                                                    // borderRightColor: statusesColors[event.status],
                                                }}
                                            >
                                                <Text numberOfLines={1} style={{ color: statusesColors[event.status] }}>{event.name}</Text>
                                            </View>
                                        </TouchableNativeFeedback>
                                    )
                                })}
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            );
        });
    };

    const RenderWeekView = () => {
        return <View style={[styles.main, { flexDirection: 'row' }]}>
            <View>
                <View style={{ paddingBottom: 38, borderRightWidth: 1, borderRightColor: colors.menuColor }}>
                    {isLoadingRooms && (
                        <View style={{ width: 100, marginTop: 15 }}>
                            <ActivityIndicator animating />
                        </View>
                    )}

                    {!isLoadingRooms && !rooms && <View style={{ width: 100, marginTop: 15, padding: 10 }}>
                        <Text>
                            Добавте помешкання
                        </Text>
                    </View>}
                </View>
                {!isLoadingRooms && (
                    <ScrollView style={{ width: 100 }}>
                        {rooms && rooms.length > 0 && rooms.map((room, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: defineBgColor(room), borderBottomWidth: 1, borderRightWidth: 1, borderRightColor: colors.menuColor, borderBottomColor: colors.menuColor }}
                                onPress={() => navigate('CalendarController', { room_id: room.id, mode: "update", type: "room" })}>
                                <Text>{room.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                onScroll={handleScroll}
                scrollEventThrottle={32}
            >
                {displayedDates.map((week, index) => (
                    <View key={index}>
                        <View style={[styles.row, isSameDay(week, new Date()) ? { width: 50, borderRightWidth: 1, borderRightColor: colors.menuColor, backgroundColor: colors.accent } : { width: 50, borderRightWidth: 1, borderRightColor: colors.menuColor }]}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center' }}>{format(week, 'EEE', { timeZone: 'Europe/Kiev' })}</Text>
                                <Text style={{ textAlign: 'center' }}>{week.getDate()}</Text>
                            </View>
                        </View>
                        <RenderRoomRows week={week} />
                    </View>
                ))}
            </ScrollView>
        </View>
    };

    return RenderWeekView();
}

const getEventsForRoomAndDay = (room: IRoomEntity, startDate: Date, endDate: Date) => {
    if (room.bookings.length === 0) {
        return []
    }

    const eventsForRoomAndDay = room.bookings.filter((booking) =>
        startDate <= new Date(booking.end_date) &&
        endDate > new Date(booking.start_date)
    );

    return eventsForRoomAndDay;
};

const getDatesForMonth = (baseDate: Date, numberDays: number = 0): Date[] => {
    const startDateKiev = utcToZonedTime(addDays(baseDate, numberDays), kievTimeZone);
    const endDateKiev = utcToZonedTime(addDays(startDateKiev, 6), kievTimeZone);

    const week = eachDayOfInterval({
        start: startDateKiev,
        end: endDateKiev,
    });

    return week;
};

const defineBgColor = (room: IRoomEntity) => room.with_color ? `rgba(${parseInt(room.color.slice(1, 3), 16)}, ${parseInt(room.color.slice(3, 5), 16)}, ${parseInt(room.color.slice(5, 7), 16)}, 0.5)` : 'transparent';

const styles = StyleSheet.create({
    main: {
        flex: 1
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    weekDayText: {
        color: 'gray',
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
    },
    selectedLabel: {
        color: 'white',
    },
    touchable: {
        borderRadius: 20,
        padding: 7.5,
        height: 35,
        width: 35,
    },
    selectedTouchable: {
        backgroundColor: 'green',
    },
    weekDayItem: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    roomRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    roomCell: {
        position: 'relative',
        height: 50,
        borderRightWidth: 1,
        flex: 1, // Adjust the flex value to fit the cells within the view
        alignItems: 'center',
        justifyContent: 'center',
    },
});