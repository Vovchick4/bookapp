import { ScrollView } from "react-native-gesture-handler";

import { RoomForm } from "../components";

export default function UpdateRoom({ }: any) {
    return (
        <ScrollView>
            <RoomForm roomData={{}} onSubmit={() => { }} />
        </ScrollView>
    )
}
