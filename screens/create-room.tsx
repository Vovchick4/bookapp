import { ScrollView } from "react-native-gesture-handler";

import { RoomForm } from "../components";

export default function CreateRoom({ }: any) {
    return (
        <ScrollView>
            <RoomForm roomData={{}} onSubmit={() => { }} />
        </ScrollView>
    )
}
