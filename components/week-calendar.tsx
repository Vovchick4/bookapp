import { useEffect, useRef, useState } from "react";
import { format, utcToZonedTime } from "date-fns-tz";
import { NativeSyntheticEvent, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { addDays, addMonths, differenceInCalendarDays, eachDayOfInterval, eachWeekOfInterval, endOfMonth, getDate, isSameDay, startOfMonth, startOfWeek, subDays } from "date-fns";

import { useCalendar } from "../contexts/calendar";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

type Props = {
    date: Date;
    rooms: any[];
    navigate: any;
};

export default function WeekCalendar({ date, rooms, navigate }: Props) {
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
        if (displayedDates && displayedDates[pos + 6]) {
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

    const renderRoomRows = (week: any) => {
        return rooms.map((room, roomIndex) => {
            const endDate = addDays(week, 1);
            const events = getEventsForRoomAndDay(room, week, endDate);

            return (
                <View key={roomIndex}>
                    <TouchableOpacity onPress={() => navigate("CreateEvent", { roomId: room.id, roomName: room.name, startDate: new Date(week) })}>
                        <View style={[styles.roomRow, { width: 50 }]}>
                            <View style={[styles.roomCell, { borderRightColor: colors.menuColor }]}>
                                {events.map((event: any, eventIndex: any) => {
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
                                        <TouchableOpacity
                                            key={eventIndex}
                                            onPress={() => navigate("UpdateEvent", { ...event, roomName: room.name })}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                zIndex: 9999,
                                                height: '100%',
                                                width: '100%',
                                                opacity: 1,
                                                borderRightWidth: 1,
                                                borderRightColor: colors.menuColor,
                                                backgroundColor: colors.menuColor
                                                // transform: [{ skewX: '30deg' }, { skewY: '30deg' }]
                                            }}
                                        />
                                    )
                                })}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        });
    };

    const renderWeekView = () => {
        return <View style={[styles.main, { flexDirection: 'row' }]}>
            <View>
                <View style={{ paddingBottom: 35, borderRightWidth: 1, borderRightColor: colors.menuColor }}>
                    {/* <Text>1</Text> */}
                </View>
                <ScrollView style={{ width: 100 }}>
                    {rooms.length > 0 && rooms.map((room, index) => (
                        <View key={index} style={{ flex: 1, height: 50, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderRightWidth: 1, borderRightColor: colors.menuColor, borderBottomColor: colors.menuColor }}>
                            <Text>{room.name}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                onScroll={handleScroll}
                scrollEventThrottle={32}
            >
                {displayedDates.map((week, index) => (
                    <View key={index}>
                        <View style={[styles.row, { width: 50, borderRightWidth: 1, borderRightColor: colors.menuColor }]}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center' }}>{format(week, 'EEE', { timeZone: 'Europe/Kiev' })}</Text>
                                <Text style={{ textAlign: 'center' }}>{week.getDate()}</Text>
                            </View>
                        </View>
                        {renderRoomRows(week)}
                    </View>
                ))}
            </ScrollView>
        </View>
    };

    return renderWeekView();
}

const getEventsForRoomAndDay = (room: any, startDate: Date, endDate: Date) => {
    if (room.bookings.length === 0) {
        return []
    }

    const eventsForRoomAndDay = room.bookings.filter((booking: any) =>
        startDate <= booking.endDate &&
        endDate >= booking.startDate
    );

    return eventsForRoomAndDay;
};

const getDatesForMonth = (baseDate: Date, numberDays: number = 0): Date[] => {
    const kievTimeZone = 'Europe/Kiev';
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
        borderRightWidth: 1,
        flex: 1, // Adjust the flex value to fit the cells within the view
        alignItems: 'center',
        justifyContent: 'center',
    },
});