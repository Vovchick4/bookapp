import { useState } from "react";
import { Dimensions, } from "react-native";
import { Icon, Text } from "react-native-paper";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import ProfileRoute from "../components/profile-route";
import CopmanyRoute from "../components/company-route";

const renderScene = SceneMap({
    user: ProfileRoute,
    company: CopmanyRoute,
});

const routes = [
    {
        key: "user",
        title: "Профіль",
        icon: "face-man-profile"
    },
    {
        key: "company",
        title: "Компанія",
        icon: "domain"
    },
]

const renderIcon = ({ route, focused, color }: any) => (
    <Icon source={route.icon} size={24} color={focused ? 'white' : color} />
);

const renderTabBar = (props: any, colors: any) => (
    <TabBar
        {...props}
        renderIcon={({ route, focused }) => renderIcon({ route, focused, color: 'black' })}
        renderLabel={({ route, focused }) => (
            <Text style={{ color: focused ? colors.surface : colors.onSurface }}>{route.title}</Text>
        )}
        style={{ backgroundColor: colors.menuColor }} // Tab bar background color
        tabStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }} // Individual tab style
    />
);

const initialLayout = { width: Dimensions.get('window').width };

export default function Profile({ route: { params } }: any) {
    const { colors } = useAppTheme();
    const [index, setIndex] = useState(params?.tabIndex || 0);

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            renderTabBar={(props) => renderTabBar(props, colors)}
        />
    )
}
