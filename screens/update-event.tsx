import { View, Text } from "react-native";

export default function UpdateEvent({ route }: any) {
    return (
        <View>
            <Text>{JSON.stringify(route, null, 4)}</Text>
        </View>
    )
}
