import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen, RegisterScreen } from "../screens";

const Stack = createNativeStackNavigator();

export default function AuthLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}
