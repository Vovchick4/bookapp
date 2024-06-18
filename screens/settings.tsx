import { View } from "react-native"
import { Text, Card, Button } from "react-native-paper";

import { addDays, format } from "date-fns";
import { useAuth } from "../contexts/auth";
import { trial_days } from "../constants/app";
import isTrialDate from "../utils/is_trial_date";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

export default function SettingsScreen() {
    const { user } = useAuth();
    const { colors } = useAppTheme();

    return (
        <View style={{ paddingVertical: 10 }}>
            <View style={{ paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: colors.menuColor }}>
                <View style={{ paddingHorizontal: 20 }}>
                    {/* Wrap the text within a <Text> component */}
                    <Text style={{ fontSize: 18 }}>Підписки</Text>
                </View>
            </View>

            {!!user?.is_subscription && (
                <Card>
                    <Card.Title title="Підписка на місяць" subtitle={"7$/міс"} />
                    <Card.Content>
                        {/* Wrap the text within a <Text> component */}
                        <Text variant="titleLarge">Статус: Активна</Text>
                    </Card.Content>
                    <Button textColor={colors.error}>Відмінити підписку</Button>
                </Card>
            )}

            {user?.trial_date && (
                <Card style={{ opacity: isTrialDate(user?.trial_date) ? 1 : 0.5 }}>
                    <Card.Title
                        title={isTrialDate(user?.trial_date) ? "Ви використовуєте пробну версію" : "Пробний період закінчився"}
                    />
                    <Card.Content>
                        {/* Wrap the text within a <Text> component */}
                        <Text variant="titleLarge">
                            {isTrialDate(user?.trial_date)
                                ? `Безкоштовний пробний період закінчується ${format(addDays(new Date(user?.trial_date), trial_days), 'P')}`
                                : `Безкоштовний пробний період закінчився ${format(addDays(new Date(user?.trial_date), trial_days), 'P')}`}
                        </Text>
                    </Card.Content>
                </Card>
            )}
        </View>
    );
}
