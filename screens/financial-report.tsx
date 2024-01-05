import { useState } from "react";
import { Icon } from "react-native-paper";
import { Dimensions, Text } from "react-native";
import { TabBar, TabView, SceneMap } from "react-native-tab-view";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import FinanceRoute from "../components/finance-route";
import DetailRoute from "../components/detail-route";
import { FinancesProvider } from "../contexts/finances-report";

const renderScene = SceneMap({
    finance: FinanceRoute,
    detail: DetailRoute,
});

const routes = [
    {
        key: "finance",
        title: "Фінанси",
        icon: "finance"
    },
    {
        key: "detail",
        title: "Деталі",
        icon: "details"
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

export default function FinancialReport() {
    const { colors } = useAppTheme();
    const [index, setIndex] = useState(0);

    return (
        <FinancesProvider>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={(props) => renderTabBar(props, colors)}
            />
        </FinancesProvider>
    )
}
