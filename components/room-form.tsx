import { useEffect } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

interface Props {
    mode?: string;
    roomData: any
    onSubmit: (data: any) => void;
}

export default function RoomForm({ mode, roomData, onSubmit }: Props) {
    const { colors } = useAppTheme();
    const navigation = useNavigation();

    useEffect(() => {
        // StatusBar.setBackgroundColor(statusesColors[values.status]);
        navigation.setOptions({
            // headerStyle: {
            //     backgroundColor: statusesColors[values.status],
            // },
            title: mode === "update" ? "Редагувати помешкання" : "Створити помешкання",
            headerRight: () => (
                <IconButton icon="content-save" />
            ),
            headerLeft: () => (
                <IconButton icon="keyboard-backspace" iconColor={colors.surface} size={28} onPress={() => {
                    navigation.goBack()
                }} />
            ),
        });
    }, [mode])

    return (
        <View>

        </View>
    )
}
