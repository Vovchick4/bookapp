import { useEffect, useState } from "react";
import PagerView from "react-native-pager-view";
import { format, utcToZonedTime } from "date-fns-tz";
import { NativeSyntheticEvent, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { addDays, addMonths, differenceInCalendarDays, eachDayOfInterval, eachWeekOfInterval, endOfMonth, getDate, isSameDay, startOfMonth, startOfWeek, subDays } from "date-fns";

import { useCalendar } from "../contexts/calendar";

type Props = {
    date: Date;
    rooms: any[];
};

export default function WeekCalendar({ date, rooms }: Props) {
    const { onChangeInterval } = useCalendar();
    const [displayedDates, setDisplayedDates] = useState<Date[][]>([]);
    const [pos, setPos] = useState(0);

    useEffect(() => {
        if (date) {
            const initialDates = getDatesForMonth(date); // Initial two months
            onChangeInterval(initialDates, 0);
            setDisplayedDates(initialDates);
        }
    }, [date]);

    useEffect(() => {
        if (displayedDates && displayedDates[pos] && displayedDates[pos][0]) {
            onChangeInterval(displayedDates, pos); // get current date interval
        }
    }, [pos, displayedDates])

    // const getDatesForRange = (baseDate: Date, months: number): Date[][] => {
    //     const startDate = subDays(baseDate, months * 30);
    //     const endDate = addDays(baseDate, months * 30);

    //     const weeks = eachWeekOfInterval(
    //         {
    //             start: startDate,
    //             end: endDate,
    //         },
    //         { weekStartsOn: 1 }
    //     );

    //     const dates = weeks.map((week) =>
    //         eachDayOfInterval({
    //             start: week,
    //             end: addDays(week, 6),
    //         })
    //     );

    //     return dates;
    // };

    const handleScroll = (event: NativeSyntheticEvent<any>) => {
        const { position, offset } = event.nativeEvent;
        const totalPages = displayedDates.length;

        //setCurrentDateInterval(`${format(displayedDates[position][0], 'MMM d')} - ${format(displayedDates[position][6], 'MMM d')}`); // get current date interval
        setPos(position);

        if (offset === 0 && (position === 0 || position === totalPages - 1)) {
            const currentMonth = addMonths(displayedDates[position][0], position === 0 ? -1 : 1);
            const newDates = getDatesForMonth(currentMonth);

            const updatedDates = position === 0 ? [...newDates, ...displayedDates.slice(0, totalPages - 1)] : [...displayedDates.slice(1), ...newDates];
            setDisplayedDates(updatedDates);
        }
    };

    return (
        <View style={styles.main}>
            <PagerView style={styles.main} onPageScroll={handleScroll}>
                {displayedDates.map((week, index) => {
                    return (
                        <View key={index}>
                            <View style={styles.row}>
                                {week.map((dt, index) => {
                                    const text = format(dt, 'EEE');

                                    return (
                                        <View key={index} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text>{text}</Text>
                                            <Text>{dt.getDate()}</Text>
                                        </View>
                                    )
                                })}
                            </View>
                            {/* Dispay cells of grid */}
                            {rooms.map((room, roomIndex) => (
                                <View key={roomIndex}>
                                    <View style={styles.roomRow}>
                                        {week.map((dt, dayIndex) => {
                                            const endDate = addDays(dt, 1);
                                            const events = getEventsForRoomAndDay(room, dt, endDate);

                                            return (
                                                <View key={dayIndex} style={styles.roomCell}>
                                                    {/* <Text>{room.name}</Text> */}

                                                    {events.map((event: any, eventIndex: number) => {
                                                        // Calculate event duration in days
                                                        const eventStart = new Date(event.startDate);
                                                        const eventEnd = new Date(event.endDate);
                                                        const durationInDays = differenceInCalendarDays(eventEnd, eventStart) + 1;
                                                        //console.log("🚀 ~ file: week-calendar.tsx:134 ~ {events.map ~ durationInDays:", durationInDays)

                                                        // Calculate the position of the event within the week
                                                        const eventStartIndex = differenceInCalendarDays(eventStart, week[0]);

                                                        return (
                                                            <View
                                                                key={eventIndex}
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: (0), // Adjust cellWidth as needed
                                                                    height: '100%',
                                                                    width: '100%', // Adjust cellWidth as needed
                                                                    backgroundColor: event.color, // Set your desired background color
                                                                    opacity: 0.5, // Adjust opacity as needed
                                                                }}
                                                            >
                                                                {/* <Text>{event.eventName}</Text> */}
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )
                })}
            </PagerView>
        </View>
    )
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

const getDatesForMonth = (baseDate: Date): Date[][] => {
    const kievTimeZone = 'Europe/Kiev';
    const startDate = startOfMonth(baseDate);
    const endDate = endOfMonth(baseDate);

    // Встановлення часового поясу для початку і кінця місяця
    const startDateKiev = utcToZonedTime(startDate, kievTimeZone);
    const endDateKiev = utcToZonedTime(endDate, kievTimeZone);

    console.log("Start of month in Kiev timezone:", startDateKiev);
    console.log("End of month in Kiev timezone:", endDateKiev);

    const weeks = eachWeekOfInterval(
        {
            start: startDateKiev,
            end: endDateKiev,
        },
        { weekStartsOn: 1 }
    );

    const dates = weeks.map((week) =>
        eachDayOfInterval({
            start: week,
            end: addDays(week, 6),
        })
    );

    return dates;
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
        borderWidth: 1,
        borderColor: 'black',
        flex: 1, // Adjust the flex value to fit the cells within the view
        alignItems: 'center',
        justifyContent: 'center',
    },
});