import { View } from "react-native";
import { Button } from "react-native-paper";

export default function DrawerContent({ navigation }: any) {

    return (
        <View>
            <Button
                onPress={() => {
                    // Navigate using the `navigation` prop that you received
                    navigation.navigate('SomeScreen');
                }}
            >
                Home
            </Button>
        </View>
    )
}