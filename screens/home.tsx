import moment from "moment";
import { useState } from "react";
import { Agenda, AgendaEntry, AgendaSchedule, DateData } from "react-native-calendars";
import { Text, View } from "react-native";

export const RenderItem = ({ item, dayIndex, daysTotal }: any) => (
    <View style={{
        backgroundColor: 'red',
        borderRadius: 10,
        elevation: 5,
    }}>
        <Text>{item.title}</Text>
        <Text>{dayIndex} of {daysTotal}</Text>
    </View>
)

const data: AgendaSchedule = {
    '2023-12-02': [ // Date in 'YYYY-MM-DD' format
        {
            name: 'Lunch Appointment',
            height: 12,
            day: '2023-12-02T13:20:00', // Date in ISO string format
        },
        // Add more items for this date if needed
    ],
    // Add more dates with their respective items as required
};

export default function Home() {
    const [events, setEvents] = useState({})

    const renderItem = (item: AgendaEntry) => {
        return (
            <View>
                <Text>{item.name}</Text>
                {/* Render other details of the item */}
            </View>
        );
    };

    const renderEmptyDate = () => {
        return (
            <View>
                <Text>This is empty date!</Text>
            </View>
        );
    };

    const loadItems = (day: DateData) => {
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!events[strTime]) {
                    events[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        events[strTime].push({
                            name: '',
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            day: strTime
                        });
                    }
                }
            }

            const newItems: AgendaSchedule = {};
            Object.keys(events).forEach(key => {
                newItems[key] = events[key];
            });
            setEvents(newItems);
        }, 1000);
    };

    return (
        <View style={{ flex: 1 }}>
            <Agenda
                testID="agenda"
                items={events}
                loadItemsForMonth={loadItems}
                renderItem={(item) => renderItem(item)}
                renderEmptyData={renderEmptyDate}
            />
        </View>
    )
}

function timeToString(dt: number) {
    const date = new Date(dt);
    return date.toISOString().split('T')[0]
}
