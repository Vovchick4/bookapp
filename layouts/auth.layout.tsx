import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen, RegisterScreen } from "../screens";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

const Stack = createNativeStackNavigator();

export default function AuthLayout() {
    const { colors } = useAppTheme()

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.menuColor // Set your desired background color
                },
                headerTintColor: colors.surface
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}
