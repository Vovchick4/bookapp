import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomeScreen } from "../screens";
import { DrawerContent } from "../components";

const Drawer = createDrawerNavigator();

export default function DefaultLayout() {
    return (
        <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
            <Drawer.Screen name="Home" component={HomeScreen} />
        </Drawer.Navigator>
    )
}