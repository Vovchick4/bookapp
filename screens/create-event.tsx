import { ScrollView } from "react-native";
import { EventForm } from "../components";

export default function CreateEvent({ route }: any) {
    return (
        <ScrollView>
            <EventForm mode="create" eventData={{ roomName: route.params.roomName, startDate: route.params.startDate }} onSubmit={() => { }} />
        </ScrollView>
    )
}