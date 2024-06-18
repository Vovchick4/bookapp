import { ScrollView } from "react-native";
import { Card, Button, Text } from "react-native-paper";
import { CardField, useStripe } from '@stripe/stripe-react-native';

import { useAuth } from "../contexts/auth";
import useTrialVersionMutate from "../hooks/use-trial-veesion-mutate";
import { useAppTheme } from "../providers/with-react-paper-ui/with-react-paper-ui";

export default function SubscriptionScreen() {
    const { user } = useAuth();
    const { colors } = useAppTheme();
    const { confirmPayment } = useStripe();
    const { mutate: getTrialVMutate, isPending: isTrialVPending } = useTrialVersionMutate();

    return (
        <ScrollView>
            <Card>
                <Card.Content>
                    <Card.Title title={"Підписка на місяць"} />
                    <Card.Title title={"7$ на місяць"} titleStyle={{ fontSize: 14 }} />

                    <CardField
                        postalCodeEnabled={false}
                        placeholders={{
                            number: '4242 4242 4242 4242',
                        }}
                        cardStyle={{
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000',
                        }}
                        style={{
                            width: '100%',
                            height: 50,
                            marginVertical: 10,
                        }}
                        onCardChange={(cardDetails) => {
                            console.log('cardDetails', cardDetails);
                        }}
                        onFocus={(focusedField) => {
                            console.log('focusField', focusedField);
                        }}
                    />
                    <Button
                        disabled={isTrialVPending}
                        loading={isTrialVPending}
                        style={[{ borderRadius: 15, }]}
                        mode="outlined"
                        textColor={colors.surface}
                        buttonColor={colors.statusPaid}
                    >
                        Підписатися
                    </Button>
                </Card.Content>
            </Card>

            {!user?.trial_date && (
                <>
                    <Text style={{ textAlign: "center", marginVertical: 20 }}>Або</Text>

                    <Card>
                        <Card.Content>
                            <Button
                                disabled={isTrialVPending}
                                loading={isTrialVPending}
                                style={[{ borderRadius: 15 }]}
                                mode="outlined"
                                textColor={colors.surface}
                                buttonColor={colors.orangeColor}
                                onPress={() => getTrialVMutate()}
                            >
                                Пробна версія на 7 днів
                            </Button>
                        </Card.Content>
                    </Card>
                </>
            )}
        </ScrollView>
    )
}
