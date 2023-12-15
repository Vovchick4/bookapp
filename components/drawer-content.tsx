import { Avatar, Drawer, Icon, Text } from "react-native-paper";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/auth";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

export default function DrawerContent(props: any) {
    const { colors } = useAppTheme();
    const { user, signOut } = useAuth();

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ backgroundColor: colors.menuColor }}>
                    <SafeAreaView style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Avatar.Text style={{ backgroundColor: colors.orangeColor }} size={80} label={user?.name || ""} />
                        <Text style={{ color: colors.surface, marginTop: 20, paddingBottom: 20, fontFamily: 'sans-serif-condensed', fontSize: 17 }}>{`${user?.email}`}</Text>
                    </SafeAreaView>
                </View>

                <Drawer.Item
                    rippleColor={colors.grayColor}
                    style={{ backgroundColor: colors.surface, borderRadius: 15, width: '100%', marginLeft: 0 }}
                    icon="calendar"
                    label="Calendar"
                    onPress={() => props.navigation.navigate("Calendar")}
                />
            </ScrollView>

            <View style={{ borderTopColor: colors.grayColor, borderTopWidth: 1 }}>
                <Drawer.Item
                    rippleColor={colors.grayColor}
                    style={{ backgroundColor: colors.surface, borderRadius: 15, width: '100%', marginLeft: 0 }}
                    icon="domain"
                    label={"Компанія: " + user?.company.name}
                    onPress={signOut}
                />

                <Drawer.Item
                    rippleColor={colors.grayColor}
                    style={{ backgroundColor: colors.surface, borderRadius: 15, width: '100%', marginLeft: 0 }}
                    icon="exit-to-app"
                    label="Вийти"
                    onPress={signOut}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 25,
        fontWeight: '500',
    },
});