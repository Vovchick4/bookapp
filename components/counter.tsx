import { Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

export default function Counter({ count = 0, onPress }: { count: number, onPress: (type: string) => void }) {
    const {colors} = useAppTheme();
    
    return (
        <View style={{ marginTop: 15, flexDirection: 'row', gap: 5 }}>
            <Entypo name="circle-with-minus" size={27} onPress={() => onPress("minus")} disabled={Math.abs(count) === 1} color={Math.abs(count) === 1 ? colors.grayColor : colors.orangeColor} />
            <Text style={{fontSize: 17}}>{Math.abs(count).toString()}</Text>
            <Entypo name="circle-with-plus" size={27} onPress={() => onPress("plus")} color={colors.orangeColor} />
        </View>
    )
}
