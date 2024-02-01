import { format, utcToZonedTime } from "date-fns-tz";
import { ActivityIndicator } from "react-native-paper";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import { addDays, addMonths, differenceInDays, eachDayOfInterval, isSameDay, isSaturday, isSunday, isWithinInterval } from "date-fns";
import { NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

import hexToRgba from "../utils/hex-to-rgba";
import { IRoomEntity } from "../types/room.entity";
import defineBgColor from "../utils/define-bg-color";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import { ECalendarViewType, TSatusColors, useCalendar } from "../contexts/calendar";

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
    const { calendarViewType, onChangeInterval } = useCalendar();
    const [displayedDates, setDisplayedDates] = useState<Date[]>([]);
    // const [pos, setPos] = useState(0);
    // const deferredPos = useDeferredValue(pos);
    const deferredDates = useDeferredValue(displayedDates);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const [isPending, startTransiton] = useTransition();

    useEffect(() => {
        if (date) {
            const initialDates = getDatesForMonth(date, 0, calendarViewType); // Initial two months
            setDisplayedDates(initialDates);
            onChangeInterval(initialDates, 0);
        }
    }, [date, calendarViewType]);

    // useEffect(() => {
    //     if (deferredDates && deferredDates[pos + 4]) {
    //         onChangeInterval(deferredDates, pos); // get current date interval
    //     }
    // }, [deferredPos, deferredDates])

    const handleScroll = (event: NativeSyntheticEvent<any>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        // console.log("🚀 ~ file: week-calendar.tsx:35 ~ handleScroll ~ contentOffset:", contentOffset, layoutMeasurement.width, contentSize.width)

        if (contentOffset.x < 10) {
            startTransiton(() => {
                loadPreviousData({ layoutMeasurement }); // Функція для підгрузки даних вліво
            })
        } else if (contentOffset.x > contentSize.width - layoutMeasurement.width - 100) {
            startTransiton(() => {
                loadNextData(); // Функція для підгрузки даних вправо
            })
        }


        // // Визначаємо інтервал після того, як скрол зупинився з затримкою 200 мс
        // const handleStopScrolling = setTimeout(() => {
        // const pageIndex = Math.floor(contentOffset.x / layoutMeasurement.width);
        // const posAfterScroll = pageIndex * (deferredDates.length / 7);
        // setPos(posAfterScroll);

        //     // Підгрузка додаткових даних вліво або вправо

        // }, 200);
        // // Очищаємо таймаут при новому скролі
        // clearTimeout(handleStopScrolling);
    };

    const loadPreviousData = ({ layoutMeasurement }: any) => {
        // Логіка для підгрузки даних вліво
        // Наприклад, якщо ви хочете завантажити попередні тижні
        const newDates = getDatesForMonth(deferredDates[0], -7);

        setDisplayedDates([...newDates, ...deferredDates]);

        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: layoutMeasurement.width, animated: false });
        }
    };

    const loadNextData = () => {
        // Логіка для підгрузки даних вправо
        // Наприклад, якщо ви хочете завантажити наступні тижні
        const newDates = getDatesForMonth(deferredDates[deferredDates.length - 1], 1);

        setDisplayedDates([...deferredDates, ...newDates]);
    };

    const RenderRoomRows = ({ week }: { week: Date }) => {
        return rooms && rooms.length !== 0 && rooms.map((room, roomIndex) => {
            const endDate = addDays(week, 1);
            const events = getEventsForRoomAndDay(room, week, endDate);
            // console.log("🚀 ~ returnrooms&&rooms.length!==0&&rooms.map ~ events:", room.bookings)

            return (
                <View key={roomIndex}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple(colors.primary, false)}
                        onPress={() => navigate("CalendarController", { mode: "create", is_room_vis: false, type: "event", room_id: room.id, roomName: room.name, start_date: new Date(week) })}
                    >
                        <View style={[styles.roomRow, { width: 50 }]}>
                            <View
                                style={[styles.roomCell,
                                {
                                    backgroundColor: defineBgColor(room) !== 'transparent' ? defineBgColor(room, isSaturday(week) || isSunday(week) ? 0.1 : 0.2) : ((isSaturday(week) || isSunday(week)) && (events?.length === 0)) ? hexToRgba(colors.grayColor, 0.1) || "" : defineBgColor(room),
                                    borderRightWidth: 1,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colors.grayColor,
                                    borderRightColor:
                                        (events && events.length > 0) ?
                                            isWithinInterval(addDays(week, 1), {
                                                start: new Date(events[0].start_date),
                                                end: new Date(events[0].end_date)
                                            }) ? hexToRgba(statusesColors[events[0].status], 0.5) || "red" : colors.grayColor : colors.grayColor,
                                    paddingRight: (events && events.length > 0) ? isSameDay(week, new Date(events[0].end_date)) ? 5 : 0 : 0,
                                    paddingLeft: (events && events.length > 0) ? isSameDay(week, new Date(events[0].start_date)) ? 5 : 0 : 0,
                                }]}>
                                {events && events.length > 0 && events.map((event, eventIndex) => {
                                    const findedSameBookDate = room.bookings.find(({ end_date }) => end_date === event.start_date);
                                    const findedSameBookDateS = room.bookings.find(({ start_date }) => start_date === event.end_date);
                                    console.log("🚀 ~ {events&&events.length>0&&events.map ~ findedSameBookDateS:", findedSameBookDateS)
                                    const isSameEndDate = findedSameBookDate && isSameDay(new Date(findedSameBookDate.end_date), new Date(week));
                                    const secondSameBookDateIndex = findedSameBookDate && room.bookings.findIndex(({ end_date }) => end_date === findedSameBookDate.end_date);
                                    const findedSecondSameBookDate = typeof secondSameBookDateIndex === 'number' ? room.bookings[secondSameBookDateIndex] : null;
                                    const isSameStartDate = findedSameBookDateS && isSameDay(new Date(findedSameBookDateS.start_date), new Date(week));

                                    return (
                                        <TouchableNativeFeedback
                                            key={eventIndex}
                                            background={TouchableNativeFeedback.Ripple(colors.primary, false)}
                                            onPress={() => navigate("CalendarController", { bookId: event.id, room_id: room.id, roomName: room.name, mode: "update", is_room_vis: false, type: "event" })}
                                        >
                                            <View
                                                style={{
                                                    position: isSameEndDate ? 'absolute' : 'relative',
                                                    top: isSameEndDate ? 4.3 : 0,
                                                    left: isSameEndDate ? 26 : 0,
                                                    bottom: 0,
                                                    zIndex: 9999,
                                                    height: '83%',
                                                    width: isSameEndDate || isSameStartDate ? '55%' : '100%',
                                                    transform: isSameStartDate ? [{ translateX: -10 }] : [],
                                                    borderTopRightRadius: isSameDay(week, new Date(event.end_date)) ? 5 : 0,
                                                    borderBottomRightRadius: isSameDay(week, new Date(event.end_date)) ? 5 : 0,
                                                    borderTopLeftRadius: isSameDay(week, new Date(event.start_date)) ? 5 : 0,
                                                    borderBottomLeftRadius: isSameDay(week, new Date(event.start_date)) ? 5 : 0,
                                                    backgroundColor: hexToRgba(statusesColors[event.status], 0.5) || 'red',
                                                    // borderRightWidth: 12,
                                                    // borderRightColor: statusesColors[event.status],
                                                }}
                                            >
                                                {isSameDay(week, new Date(event.start_date)) && (
                                                    <View
                                                        style={{
                                                            opacity: 0.5,
                                                            width: (differenceInDays(new Date(event.end_date), new Date(event.start_date)) + 1) * 50,
                                                            zIndex: 9999,
                                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'
                                                        }}
                                                    >
                                                        <Text
                                                            numberOfLines={1}
                                                            style={{
                                                                fontWeight: '800',
                                                                width: 100,
                                                                position: 'absolute',
                                                                zIndex: 9999,
                                                            }}
                                                        >{event.name}
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
                <View style={{ paddingBottom: 66, borderRightWidth: 1, borderRightColor: colors.menuColor }}>
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
                                style={{ flex: 1, height: 50.2, paddingLeft: 10, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: defineBgColor(room), borderBottomWidth: 1, borderRightWidth: 1, borderRightColor: colors.menuColor, borderBottomColor: colors.menuColor, borderTopWidth: index === 0 ? 1 : 0, borderTopColor: colors.menuColor }}
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
                {deferredDates.map((week, index) => (
                    <View key={index} style={{ position: "relative" }}>
                        <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.grayColor }, isSaturday(week) || isSunday(week) ? { width: 50, borderRightWidth: 1, borderRightColor: colors.grayColor, backgroundColor: hexToRgba(colors.grayColor, 0.1) || "" } : { width: 50, borderRightWidth: 1, borderRightColor: colors.grayColor }]}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                <Text style={{ textAlign: 'center', fontSize: 10, color: isSameDay(week, new Date()) ? colors.notification : colors.onSurface }}>{format(week, 'MMM', { timeZone: 'Europe/Kiev' })}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 10, color: isSameDay(week, new Date()) ? colors.notification : colors.onSurface }}>{format(week, 'yyyy', { timeZone: 'Europe/Kiev' })}</Text>
                                <Text style={{ textAlign: 'center', color: isSameDay(week, new Date()) ? colors.notification : colors.onSurface }}>{format(week, 'EEE', { timeZone: 'Europe/Kiev' })}</Text>
                                <Text style={{ textAlign: 'center', color: isSameDay(week, new Date()) ? colors.notification : colors.onSurface }}>{week.getDate()}</Text>
                            </View>
                        </View>
                        <RenderRoomRows week={week} />
                        {isSameDay(week, new Date()) && (
                            <View style={{
                                position: 'absolute',
                                top: 70,
                                left: 24,
                                bottom: 0,
                                zIndex: -1,
                                width: 2,
                                // height: '90%',
                                backgroundColor: colors.notification
                            }}>
                                <View style={{ position: 'absolute', right: -4, width: 10, height: 10, zIndex: -1, borderRadius: 50, backgroundColor: colors.notification }}></View>
                            </View>
                        )}
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

const getDatesForMonth = (baseDate: Date, numberDays: number = 0, viweType: ECalendarViewType = ECalendarViewType.week): Date[] => {
    const startDateKiev = utcToZonedTime(viweType === ECalendarViewType.week ? addDays(baseDate, numberDays) : addMonths(baseDate, -1), kievTimeZone);
    const endDateKiev = utcToZonedTime(viweType === ECalendarViewType.week ? addDays(startDateKiev, 6) : addMonths(startDateKiev, 1), kievTimeZone);

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
        justifyContent: 'space-between',
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