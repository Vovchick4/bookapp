import { format } from "date-fns-tz";
import { List, Text } from "react-native-paper";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { CalendarList } from "react-native-calendars";
import { StyleSheet, View, SafeAreaView, Dimensions } from "react-native";

// import { WeekCalendar } from "../components";
import { useCalendar } from "../contexts/calendar";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

const WeekCalendar = lazy(() => import('../components/week-calendar'))

const rooms = [
    {
        id: 1,
        name: "Room 1",
        bookings: [{
            eventName: 'Meeting 1',
            startDate: new Date('2023-12-20T09:00:00'),
            endDate: new Date('2023-12-21T11:00:00'),
            color: "red"
        },
        {
            eventName: 'Meeting 2',
            startDate: new Date('2023-12-23T09:00:00'),
            endDate: new Date('2023-12-27T09:00:00'),
            color: "black"
        }]
    },
    {
        id: 2,
        name: "Room 2",
        bookings: [{
            eventName: 'Meeting 1',
            startDate: new Date('2023-12-21T09:00:00'),
            endDate: new Date('2023-12-21T11:00:00'),
            color: 'blue'
        },
        {
            eventName: 'Meeting 1',
            startDate: new Date('2023-12-15T09:00:00'),
            endDate: new Date('2023-12-17T11:00:00'),
            color: 'blue'
        }]
    }
]

// Move the logic to calculate markedDates into a separate function
const calculateMarkedDates = (rooms: any) => {
    const markedDates: any = {};
    rooms.forEach((room: any) => {
        room.bookings.forEach((booking: any) => {
            let currentDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);

            while (currentDate <= endDate) {
                const formattedDate = currentDate.toISOString().split('T')[0];
                markedDates[formattedDate] = {
                    marked: true,
                    dotColor: booking.color,
                    // Other properties you want to set for these dates
                    // For example:
                    // selected: true,
                };
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
    });
    return markedDates;
};

const MemoMizedCl = ({ date, setDate, markedDates, colors }: any) => {
    return (
        useMemo(() => <CalendarList
            // Configure your calendar props here
            // For instance:
            pastScrollRange={12}
            futureScrollRange={12}
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
            markedDates={markedDates}
            // Handle onDayPress or other calendar callbacks as needed
            onDayPress={(day) => setDate(new Date(day.dateString))}
        />, [date, markedDates])
    )
}

export default function Home() {
    const { colors } = useAppTheme();
    const [date, setDate] = useState<Date>(new Date());
    const [markedDates, setMarkedDates] = useState({});
    const { isVisibleFullCalendar, openModal } = useCalendar();
    const { height: screenHeight } = Dimensions.get('window');
    const halfScreenHeight = screenHeight / 2;

    useEffect(() => {
        // Calculate markedDates when the modal is opened
        if (!markedDates || isVisibleFullCalendar) {
            const calculatedDates = calculateMarkedDates(rooms);
            setMarkedDates(calculatedDates);
        }
    }, [isVisibleFullCalendar]);

    return (
        <SafeAreaView style={styles.safe}>
            <List.Section style={{ height: isVisibleFullCalendar ? 'auto' : 0, margin: 0, paddingLeft: 0 }}>
                <List.Accordion
                    titleStyle={{ color: colors.menuColor }}
                    style={{ margin: 0, padding: 0 }}
                    title={`Сьогоднішня дата, ${format(new Date(), 'MMMM d, yyyy', { timeZone: 'Europe/Kiev' })}`}
                    left={() => (<></>)}
                    right={() => (<></>)}
                    expanded={isVisibleFullCalendar}
                    onPress={openModal}>
                    <View style={{ paddingLeft: 0, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ maxHeight: halfScreenHeight }}>
                            <MemoMizedCl date={date} setDate={setDate} colors={colors} markedDates={markedDates} />
                        </View>
                    </View>
                </List.Accordion>
            </List.Section>

            <Suspense fallback={<Text>loading data ...</Text>}>
                <WeekCalendar date={date} rooms={rooms} />
            </Suspense>
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

