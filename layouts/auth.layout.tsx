import { Stack } from "../App";
import { LoginScreen, RegisterScreen } from "../screens";

export default function AuthLayout() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}
