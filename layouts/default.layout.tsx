import { Drawer } from "../App";
import { HomeScreen } from "../screens";

export default function DefaultLayout() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeScreen} />
        </Drawer.Navigator>
    )
}