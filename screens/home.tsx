import moment from "moment";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Timetable from "react-native-calendar-timetable";

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

export default function Home() {
    const [date] = useState(new Date());
    const [from] = useState(moment().subtract(3, 'days').toDate());
    const [till] = useState(moment().add(3, 'days').toDate());
    const range = { from, till };
    const [items] = useState([
        {
            title: 'Some event',
            startDate: moment().subtract(1, 'hour').toDate(),
            endDate: moment().add(1, 'hour').toDate(),
        },
    ]);

    return (
        <ScrollView>
            <Timetable items={items} date={date} renderItem={props => <RenderItem {...props} />} />
        </ScrollView>
    )
}
