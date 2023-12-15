import { IconButton } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../contexts/auth";
import { DrawerContent } from "../components";
import { CompanyScreen, HomeScreen } from "../screens";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function DefaultLayout() {
    const { colors } = useAppTheme()
    const { user, signOut } = useAuth();

    return (
        user?.company ? (
            <Drawer.Navigator
                drawerContent={(props) => <DrawerContent {...props} />}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.menuColor // Set your desired background color
                    },
                    headerTintColor: colors.surface
                }}
            >
                <Drawer.Screen name="Calendar" component={HomeScreen} />
            </Drawer.Navigator>
        ) : (
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.menuColor // Set your desired background color
                    },
                    headerTintColor: colors.surface
                }}>
                <Stack.Screen
                    name="Створити компанію"
                    component={CompanyScreen}
                    options={({ navigation }) => ({
                        headerRight: () => (
                            <IconButton icon="exit-to-app" iconColor={colors.surface} size={28} onPress={signOut} />
                        )
                    })}
                />
            </Stack.Navigator>
        )
    )
}