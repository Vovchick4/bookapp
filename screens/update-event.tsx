import { ScrollView } from "react-native";
import { EventForm } from "../components";

export default function UpdateEvent({ route }: any) {
    return (
        <ScrollView>
            <EventForm mode="update" eventData={{ ...route.params }} onSubmit={() => { }} />
        </ScrollView>
    )
}
