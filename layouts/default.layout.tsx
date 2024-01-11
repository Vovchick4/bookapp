import { Animated, Text, View } from "react-native";
import { Suspense, lazy, Fragment, useEffect, useRef, useState } from "react";
import Svg, { G, Path } from "react-native-svg";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, IconButton, Menu, Button } from "react-native-paper";

import { useAuth } from "../contexts/auth";
import { ECalendarViewType, useCalendar } from "../contexts/calendar";
import { DrawerContent, StatusBar } from "../components";
import CalendarController from "../screens/calendar-controller";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";
import { CompanyScreen, ProfileScreen, FinancesScreen, EmployeeScreen } from "../screens";

const HomeScreen = lazy(() => import('../screens/home'));
// const CalendarControllerScreen = lazy(() => import('../screens/calendar-controller'));

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export default function DefaultLayout() {
    const { colors } = useAppTheme();
    const { user, signOut } = useAuth();
    const [visibleMenu, setVisibleMenu] = useState(false);
    const { queryRoom: { refetch, isLoading, isRefetching }, calendarViewType, currentInterval, openModal, onChangeView } = useCalendar();
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isLoading || isRefetching) {
            // Start the rotation animation
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            // Stop the rotation animation
            spinValue.setValue(0);
        }
    }, [isLoading, isRefetching, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        user?.company ? (
            <Fragment>
                <StatusBar backgroundColor={colors.menuColor} />
                <Drawer.Navigator
                    drawerContent={(props) => <DrawerContent {...props} />}
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: colors.menuColor // Set your desired background color
                        },
                        headerTintColor: colors.surface
                    }}
                >
                    <Drawer.Screen
                        name="Calendar"
                        options={{
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, columnGap: 10 }}>
                                    <TouchableOpacity onPress={refetch} disabled={isLoading || isRefetching}>
                                        <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                            <MaterialCommunityIcons name="update" size={22} color={(isLoading || isRefetching) ? colors.grayColor : colors.surface} />
                                        </Animated.View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={openModal}>
                                        <View style={{ flexDirection: 'row', columnGap: 10, alignItems: 'center', justifyContent: "center", }}>
                                            <Text style={{ color: colors.surface, }}>{currentInterval}</Text>
                                            <Svg style={{ marginTop: 8 }} fill={colors.surface} height={24} width={24} viewBox="0 0 511 511">
                                                <G>
                                                    <Path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393
                                                        c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393
                                                        s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z" />
                                                </G>
                                            </Svg>
                                        </View>
                                    </TouchableOpacity>

                                    <Menu
                                        visible={visibleMenu}
                                        onDismiss={() => setVisibleMenu(false)}
                                        anchor={
                                            <TouchableOpacity onPress={() => setVisibleMenu(true)}>
                                                <Entypo size={19} color={colors.surface} name="dots-three-vertical" />
                                            </TouchableOpacity>
                                        }>
                                        <Menu.Item onPress={() => onChangeView(ECalendarViewType.week)} title="Week View" leadingIcon={() => <MaterialCommunityIcons name="calendar-week" size={22} color={calendarViewType === ECalendarViewType.week ? 'red' : 'black'} />} titleStyle={{ color: calendarViewType === ECalendarViewType.week ? 'red' : 'black' }} />
                                        <Menu.Item onPress={() => onChangeView(ECalendarViewType.month)} title="Month View" leadingIcon={() => <MaterialCommunityIcons name="calendar-month-outline" size={22} color={calendarViewType === ECalendarViewType.month ? 'red' : 'black'} />} titleStyle={{ color: calendarViewType === ECalendarViewType.month ? 'red' : 'black' }} />
                                    </Menu>
                                </View>
                            )
                        }}
                    >
                        {(props: any) => (
                            <Suspense fallback={<ActivityIndicator animating={true} color={colors.menuColor} />}>
                                <HomeScreen {...props} />
                            </Suspense>
                        )}
                    </Drawer.Screen>
                    <Drawer.Screen
                        name="Profile"
                        component={ProfileScreen}
                    />
                    <Drawer.Screen
                        name="Finances"
                        component={FinancesScreen}
                    />
                    <Drawer.Screen
                        name="Employees"
                        component={EmployeeScreen}
                    />
                    <Drawer.Screen
                        name="CalendarController"
                        options={{
                            title: "Загрузка..."
                        }}
                        component={CalendarController}
                    />
                </Drawer.Navigator>
            </Fragment>
        ) : (
            <Fragment>
                <StatusBar backgroundColor={colors.menuColor} />
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
            </Fragment>
        )
    )
}