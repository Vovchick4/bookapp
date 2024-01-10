import Collapsible from "react-native-collapsible";
import { CalendarList } from "react-native-calendars";
import { useIsFocused } from "@react-navigation/native";
import { Suspense, lazy, useMemo, useState } from "react";
import { ActivityIndicator, FAB, Portal } from "react-native-paper";
import { StyleSheet, View, SafeAreaView, Dimensions, Alert } from "react-native";

import { IRoomEntity } from "../types/room.entity";
import { EventStatus } from "../types/event.entity";
import { TSatusColors, useCalendar } from "../contexts/calendar";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

interface IMarkedDates {
    [date: string]: {
        periods?: {
            startingDay?: boolean;
            endingDay?: boolean;
            color: string;
            // Other properties you want to set for these periods
            // For example:
            // textColor?: string;
        }[];
        // Other properties for each date
    };
}

const WeekCalendar = lazy(() => import('../components/week-calendar'))

const calculateMarkedDates = (rooms: IRoomEntity[], statusesColors: TSatusColors): IMarkedDates => {
    const markedDates: IMarkedDates = {};
    rooms.forEach((room: IRoomEntity) => {
        room.bookings.forEach((booking) => {
            const startDate = new Date(booking.start_date);
            const endDate = new Date(booking.end_date);

            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            if (!markedDates[formattedStartDate]) {
                markedDates[formattedStartDate] = {};
            }

            if (!markedDates[formattedStartDate].periods) {
                markedDates[formattedStartDate].periods = [];
            }

            markedDates[formattedStartDate].periods?.push({
                startingDay: true,
                endingDay: true,
                color: statusesColors[booking.status],
                // Other properties you want to set for these periods
                // For example:
                // textColor: 'white',
            });

            if (formattedStartDate !== formattedEndDate) {
                if (!markedDates[formattedEndDate]) {
                    markedDates[formattedEndDate] = {};
                }

                if (!markedDates[formattedEndDate].periods) {
                    markedDates[formattedEndDate].periods = [];
                }

                markedDates[formattedEndDate].periods?.push({
                    endingDay: true,
                    color: statusesColors[booking.status],
                    // Other properties you want to set for these periods
                    // For example:
                    // textColor: 'white',
                });

                let currentDate = new Date(startDate);
                currentDate.setDate(currentDate.getDate() + 1);

                while (currentDate.toISOString().split('T')[0] !== formattedEndDate) {
                    const formattedDate = currentDate.toISOString().split('T')[0];
                    if (!markedDates[formattedDate]) {
                        markedDates[formattedDate] = {};
                    }

                    if (!markedDates[formattedDate].periods) {
                        markedDates[formattedDate].periods = [];
                    }

                    markedDates[formattedDate].periods?.push({
                        color: statusesColors[booking.status],
                        // Other properties you want to set for these periods
                        // For example:
                        // textColor: 'white',
                    });

                    currentDate.setDate(currentDate.getDate() + 1);
                }
            }
        });
    });
    return markedDates;
};

export default function Home({ navigation: { navigate } }: any) {
    const { colors } = useAppTheme();
    const [date, setDate] = useState<Date>(new Date());
    const [isFabOpen, setIsFabOpen] = useState(false);

    const isFocused = useIsFocused();
    const { queryRoom: { data, isLoading, isRefetching }, isVisibleFullCalendar } = useCalendar();

    const { height: screenHeight } = Dimensions.get('window');
    const halfScreenHeight = screenHeight / 2;

    const statusesColors = useMemo<TSatusColors>(() => ({
        [EventStatus.fullpaid]: colors.statusPaid,
        [EventStatus.deposit]: colors.statusDeposit,
        [EventStatus.nopaid]: colors.statusNoPaid,
        [EventStatus.canceled]: colors.statusCanceled,
    }), [])

    const markedDates = useMemo(() => {
        if (data && data?.length > 0) {
            return calculateMarkedDates(data, statusesColors);
        }
    }, [data])

    // useEffect(() => {
    //     // Calculate markedDates when the modal is opened
    //     if (!markedDates || isVisibleFullCalendar) {
    //         const calculatedDates = calculateMarkedDates(rooms);
    //         setMarkedDates(calculatedDates);
    //     }
    // }, [isVisibleFullCalendar]);

    const onStateChange = ({ open }: { open: boolean }) => setIsFabOpen(pr => !pr);

    return (
        <SafeAreaView style={styles.safe}>
            <Collapsible collapsed={!isVisibleFullCalendar}>
                <View style={{ paddingLeft: 0, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ maxHeight: halfScreenHeight }}>
                        <CalendarList
                            // Configure your calendar props here
                            // For instance:
                            monthFormat={'MMMM yyyy'}
                            hideExtraDays={true}
                            firstDay={1}
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
                            markingType="multi-period"
                            markedDates={markedDates}
                            // Handle onDayPress or other calendar callbacks as needed
                            onDayPress={(day) => setDate(new Date(day.dateString))}
                        />
                    </View>
                </View>
            </Collapsible>

            <Suspense fallback={<ActivityIndicator animating={true} color={colors.menuColor} />}>
                <WeekCalendar date={date} rooms={data} navigate={navigate} isLoadingRooms={(isLoading || isRefetching)} statusesColors={statusesColors} />
            </Suspense>

            {!isLoading && <Portal>
                <FAB.Group
                    open={isFabOpen}
                    visible={isFocused}
                    icon={'plus'}
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

