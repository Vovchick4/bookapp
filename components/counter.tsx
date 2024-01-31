import { Entypo } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

export default function Counter({ count = 0, onPress }: { count: number, onPress: (type: string) => void }) {
    const { colors } = useAppTheme();

    return (
        <View style={{ marginTop: 15, flexDirection: 'row', gap: 5 }}>
            <TouchableOpacity onPress={() => onPress("minus")}>
                <Entypo name="circle-with-minus" size={27} disabled={Math.abs(count) === 1} color={Math.abs(count) === 1 ? colors.grayColor : colors.orangeColor} />
            </TouchableOpacity>
            <Text style={{ fontSize: 17 }}>{Math.abs(count).toString()}</Text>
            <TouchableOpacity onPress={() => onPress("plus")}>
                <Entypo name="circle-with-plus" size={27} color={colors.orangeColor} />
            </TouchableOpacity>
        </View>
    )
}
