import { useEffect, useRef, useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import { format, utcToZonedTime } from "date-fns-tz";
import { addDays, differenceInDays, eachDayOfInterval, isSameDay } from "date-fns";
import { NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

import hexToRgba from "../utils/hex-to-rgba";
import { IRoomEntity } from "../types/room.entity";
import defineBgColor from "../utils/define-bg-color";
import { ActivityIndicator } from "react-native-paper";
import { TSatusColors, useCalendar } from "../contexts/calendar";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

type Props = {
    date: Date;
    navigate: any;
    isLoadingRooms: boolean;
    rooms: IRoomEntity[] | undefined;
    statusesColors: TSatusColors;
    onOpenFilter: () => void;
};

const kievTimeZone = 'Europe/Kiev';

export default function WeekCalendar({ date, rooms, navigate, isLoadingRooms, statusesColors, onOpenFilter }: Props) {
    const { colors } = useAppTheme();
    const { onChangeInterval } = useCalendar();
    const [displayedDates, setDisplayedDates] = useState<Date[]>([]);
    const [pos, setPos] = useState(0);
    const scrollViewRef = useRef<ScrollView | null>(null);

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
                            <View style={[styles.roomCell, { backgroundColor: defineBgColor(room), borderRightWidth: 1, borderRightColor: (events && events.length > 0) ? isSameDay(week, new Date(events[0].start_date)) ? statusesColors[events[0].status] : colors.menuColor : colors.menuColor, }]}>
                                {events && events.length > 0 && events.map((event, eventIndex) => {
                                    return (
                                        <TouchableNativeFeedback
                                            key={eventIndex}
                                            background={TouchableNativeFeedback.Ripple(colors.primary, false)}
                                            onPress={() => navigate("CalendarController", { bookId: event.id, room_id: room.id, roomName: room.name, mode: "update", is_room_vis: false, type: "event" })}
                                        >
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '100%',
                                                    backgroundColor: hexToRgba(statusesColors[event.status], 0.5) || 'red',
                                                    // borderRightWidth: 12,
                                                    // borderRightColor: statusesColors[event.status],
                                                }}
                                            >
                                                {isSameDay(week, new Date(event.start_date)) && (
                                                    <View
                                                        style={{
                                                            width: (differenceInDays(new Date(event.end_date), new Date(event.start_date)) + 1) * 50,
                                                            zIndex: 9999,
                                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
                                                        }}
                                                    >
                                                        <Text
                                                            numberOfLines={1}
                                                            style={{
                                                                fontWeight: '800',
                                                                // width: 100,
                                                                position: 'absolute',
                                                                zIndex: 9999,
                                                            }}
                                                        >booksa askd kas DSF SDF SDF SDF SDF SD F SD
                                                        </Text>
                                                    </View>
                                                )}
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
        return <ScrollView><View style={[styles.main, { flexDirection: 'row' }]}>
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

                    {/* {!isLoadingRooms && rooms && rooms.length > 0 && (
                        <AntDesign name="filter" size={22} onPress={onOpenFilter} />
                    )} */}
                </View>
                {!isLoadingRooms && (
                    <ScrollView style={{ width: 100 }}>
                        {rooms && rooms.length > 0 && rooms.map((room, index) => (
                            <TouchableOpacity
                                key={index}
                                style={{ flex: 1, height: 50, paddingLeft: 10, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: defineBgColor(room), borderBottomWidth: 1, borderRightWidth: 1, borderRightColor: colors.menuColor, borderBottomColor: colors.menuColor }}
                                onPress={() => navigate('CalendarController', { room_id: room.id, mode: "update", type: "room" })}>
                                <Text style={{ fontSize: 12 }} numberOfLines={1}>
                                    <Feather name="user" />
                                    {room.count_room}
                                </Text>
                                <Text style={{ fontSize: 12 }} numberOfLines={1}>{room.name}</Text>
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
                        <View style={[styles.row, isSameDay(week, new Date()) ? { width: 50, borderRightWidth: 1, borderRightColor: colors.menuColor, backgroundColor: colors.orangeColor } : { width: 50, borderRightWidth: 1, borderRightColor: colors.menuColor }]}>
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
        </ScrollView>
    };

    return <View style={styles.main}>{RenderWeekView()}</View>;
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
        // borderRightWidth: 1,
        flex: 1, // Adjust the flex value to fit the cells within the view
        alignItems: 'center',
        justifyContent: 'center',
    },
});