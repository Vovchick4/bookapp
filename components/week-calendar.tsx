import { format, utcToZonedTime } from "date-fns-tz";
import { ActivityIndicator } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import { addDays, addMonths, differenceInDays, eachDayOfInterval, isSameDay, isSaturday, isSunday, isWithinInterval } from "date-fns";
import { Animated, Image, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";

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
    const { currentInterval, calendarViewType, onChangeInterval } = useCalendar();
    const [displayedDates, setDisplayedDates] = useState<Date[]>([]);
    const deferredDates = useDeferredValue(displayedDates);
    const scrollViewRef = useRef<ScrollView | null>(null);
    const [isPending, startTransiton] = useTransition();
    const translateYValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (date) {
            const initialDates = getDatesForMonth(date, 0, calendarViewType); // Initial two months
            setDisplayedDates(initialDates);
            onChangeInterval(initialDates, 0);
        }
    }, [date, calendarViewType]);

    const handleStickyScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: translateYValue } } }],
        { useNativeDriver: false } // Make sure to set useNativeDriver to false
    );

    const handleScroll = (event: NativeSyntheticEvent<any>) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

        if (contentOffset.x < 10) {
            startTransiton(() => {
                loadPreviousData({ layoutMeasurement }); // Функція для підгрузки даних вліво
            })
        } else if (contentOffset.x > contentSize.width - layoutMeasurement.width - 100) {
            startTransiton(() => {
                loadNextData(); // Функція для підгрузки даних вправо
            })
        }
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
                                            }) ? hexToRgba(statusesColors[events[0].status], 1) || "red" : colors.grayColor : colors.grayColor,
                                    paddingRight: (events && events.length > 0) ? isSameDay(week, new Date(events[0].end_date)) ? 22 : 0 : 0,
                                    paddingLeft: (events && events.length > 0) ? isSameDay(week, new Date(events[0].start_date)) ? 22 : 0 : 0,
                                }]}>
                                {events && events.length > 0 && events.map((event, eventIndex) => {
                                    const findedSameBookDate = room.bookings.find(({ end_date }) => end_date === event.start_date);
                                    const findedSameBookDateS = room.bookings.find(({ start_date }) => start_date === event.end_date);
                                    const isSameEndDate = findedSameBookDate && isSameDay(new Date(findedSameBookDate.end_date), new Date(week));
                                    const isSameStartDate = findedSameBookDateS && isSameDay(new Date(findedSameBookDateS.start_date), new Date(week));

                                    return (
                                        <TouchableNativeFeedback
                                            key={eventIndex}
                                            background={TouchableNativeFeedback.Ripple(colors.primary, false)}
                                            onPress={() => navigate("CalendarController", { bookId: event.id, room_id: room.id, roomName: room.name, mode: "update", is_room_vis: false, type: "event" })}
                                        >
                                            <View
                                                style={{
                                                    position: isSameEndDate || isSameStartDate ? 'absolute' : 'relative',
                                                    top: isSameEndDate || isSameStartDate ? 4 : 0,
                                                    left: isSameEndDate ? 29 : 0,
                                                    bottom: 0,
                                                    zIndex: -1,
                                                    height: isSameEndDate || isSameStartDate ? '84%' : '83%',
                                                    overflow: 'visible',
                                                    width: isSameEndDate || isSameStartDate ? '80%' : '100%',
                                                    transform: isSameStartDate ? [{ translateX: 0 }] : [],
                                                    borderTopRightRadius: isSameDay(week, new Date(event.end_date)) ? 5 : 0,
                                                    borderBottomRightRadius: isSameDay(week, new Date(event.end_date)) ? 5 : 0,
                                                    borderTopLeftRadius: isSameDay(week, new Date(event.start_date)) ? 5 : 0,
                                                    borderBottomLeftRadius: isSameDay(week, new Date(event.start_date)) ? 5 : 0,
                                                    backgroundColor: hexToRgba(statusesColors[event.status], 1) || 'red',
                                                }}
                                            >
                                                {event.sources && <RenderSource name={event.sources?.name || ""} icon={event.sources.icon || { path: null }} week={week} event_dates={{ start: new Date(event.start_date), end: new Date(event.end_date) }} isLeftDate={isSameStartDate} />}
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
        return (
            <ScrollView onScroll={handleStickyScroll}>
                <View style={[styles.main, { flexDirection: 'row' }]}>
                    <View>
                        <View style={{ borderRightWidth: 1, borderRightColor: colors.menuColor, borderBottomWidth: 1, borderBottomColor: colors.menuColor }}>
                            <View style={{ opacity: 0 }}>
                                <Text style={{ textAlign: 'center', fontSize: 10, }}>{"sdas"}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 10, }}>{2023}</Text>
                                <Text style={{ textAlign: 'center', }}>{"asda"}</Text>
                                <Text style={{ textAlign: 'center', }}>{1}</Text>
                            </View>

                            <View style={{ position: 'absolute', top: 22, left: 10 }}>
                                <Text style={{ color: colors.onSurface, }}>{currentInterval}</Text>
                            </View>

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
                                        style={{ flex: 1, height: 50, paddingLeft: 10, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: defineBgColor(room), borderBottomWidth: 1, borderRightWidth: 1, borderRightColor: colors.menuColor, borderBottomColor: colors.menuColor, borderLeftColor: room.with_color ? defineBgColor(room, 1) : 'transparent', borderLeftWidth: 4 }}
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
                                <View style={[styles.row, { opacity: 0, borderBottomWidth: 1, borderBottomColor: colors.grayColor }, isSaturday(week) || isSunday(week) ? { width: 50, borderRightWidth: 1, borderRightColor: colors.grayColor, backgroundColor: hexToRgba(colors.grayColor, 0.1) || "" } : { width: 50, borderRightWidth: 1, borderRightColor: colors.grayColor }]}>
                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                        <Text style={{ textAlign: 'center', fontSize: 10, }}>{"sdas"}</Text>
                                        <Text style={{ textAlign: 'center', fontSize: 10, }}>{2023}</Text>
                                        <Text style={{ textAlign: 'center', }}>{"asda"}</Text>
                                        <Text style={{ textAlign: 'center', }}>{1}</Text>
                                    </View>
                                </View>
                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        top: 0, // Set top position to the header height
                                        left: 0,
                                        right: 0,
                                        transform: [{ translateY: translateYValue }],
                                        zIndex: 2, // Ensure it stays above the ScrollView
                                        backgroundColor: 'white', // Set your desired background color
                                    }}
                                >
                                    <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.grayColor }, isSaturday(week) || isSunday(week) ? { width: 50, borderRightWidth: 1, borderRightColor: colors.grayColor, backgroundColor: hexToRgba(colors.grayColor, 0.1) || "" } : { width: 50, borderRightWidth: 1, borderRightColor: colors.grayColor }]}>
                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
                                            <Text style={{ textAlign: 'center', fontSize: 10, color: isSameDay(week, new Date()) ? colors.notification : colors.onSurface }}>{format(week, 'MMM', { timeZone: 'Europe/Kiev' })}</Text>
                                            <Text style={{ textAlign: 'center', fontSize: 10, color: isSameDay(week, new Date()) ? colors.notification : colors.onSurface }}>{format(week, 'yyyy', { timeZone: 'Europe/Kiev' })}</Text>
                                            <Text style={{ textAlign: 'center', color: isSameDay(week, new Date()) ? colors.notification : colors.onSurface }}>{format(week, 'EEE', { timeZone: 'Europe/Kiev' })}</Text>
                                            <Text style={{ textAlign: 'center', color: isSameDay(week, new Date()) ? colors.notification : colors.onSurface }}>{week.getDate()}</Text>
                                        </View>
                                    </View>
                                </Animated.View>

                                <RenderRoomRows week={week} />
                                {isSameDay(week, new Date()) && (
                                    <View style={{
                                        position: 'absolute',
                                        top: 70,
                                        left: 24,
                                        bottom: 0,
                                        zIndex: -1,
                                        width: 2,
                                        backgroundColor: colors.notification
                                    }}>
                                        <View style={{ position: 'absolute', right: -4, width: 10, height: 10, zIndex: -1, borderRadius: 50, backgroundColor: colors.notification }}></View>
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>)
    };

    return <View style={styles.main}>{RenderWeekView()}</View>;
}

const RenderSource = ({ name, icon, week, event_dates: { start, end }, isLeftDate }: { name: string, icon: { path: string }, week: Date, event_dates: { start: Date, end: Date }, isLeftDate: boolean | undefined }) => {
    const diff = differenceInDays(end, start);

    return (
        diff <= 1 ? (
            isWithinInterval(week, { start: new Date(start), end: new Date(end) }) &&
            <View style={{ position: 'absolute', top: 5, right: 2, width: !isLeftDate ? 50 * diff - 5 : 50 * diff - 15, pointerEvents: 'none' }}>
                <RenderSourcePromt name={name} icon={icon} />
            </View>
        ) : diff === 2 ? (
            isWithinInterval(week, { start: addDays(new Date(start), 1), end: new Date(end) }) && (
                <View style={{ position: 'absolute', top: 5, right: 2, width: 50 * diff - 5, pointerEvents: 'none' }}>
                    <RenderSourcePromt name={name} icon={icon} />
                </View>
            )
        ) : (
            isWithinInterval(week, { start: addDays(new Date(start), diff - 1), end: new Date(end) }) && (
                <View style={{ position: 'absolute', top: 5, right: 2, width: 50 * diff - 5, pointerEvents: 'none' }}>
                    <RenderSourcePromt name={name} icon={icon} />
                </View>
            )
        )
    )
}

const RenderSourcePromt = ({ name = "", icon }: { name: string, icon: { path: string | null } }) => {
    return (
        icon.path ? (
            <Image
                style={{ width: 30, height: 30, borderRadius: 50, resizeMode: 'contain' }}
                source={{ uri: icon.path }}
            />
        ) : (
            <View style={{ width: 30, height: 30, borderRadius: 50, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Text numberOfLines={1} style={{ fontSize: 9 }}>{name}</Text>
            </View>
        )
    )
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
        flex: 1, // Adjust the flex value to fit the cells within the view
        alignItems: 'center',
        justifyContent: 'center',
    },
});