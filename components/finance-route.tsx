import { ScrollView, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';

import { useAuth } from '../contexts/auth';
import { useFinancesReport } from '../contexts/finances-report';
import { useAppTheme } from '../providers/with-react-paper-ui/with-react-paper-ui';

export default function FinanceRoute() {
    const { user } = useAuth()
    const { colors } = useAppTheme();
    const { bookings, dateString, onChangeDate, fetchBookings, isPending, isStart } = useFinancesReport();

    return (
        <ScrollView style={{ padding: 15 }}>
            <DatePickerInput
                mode='flat'
                locale="en-GB"
                label="З"
                inputMode="start"
                selectionColor={colors.orangeColor}
                activeOutlineColor={colors.orangeColor}
                activeUnderlineColor={colors.orangeColor}
                value={dateString.start_date}
                onChange={(value) => onChangeDate('start_date', value)}
            />
            <DatePickerInput
                mode='flat'
                locale="en-GB"
                label="До"
                inputMode="start"
                selectionColor={colors.orangeColor}
                activeOutlineColor={colors.orangeColor}
                activeUnderlineColor={colors.orangeColor}
                value={dateString.end_date}
                onChange={(value) => onChangeDate('end_date', value)}
            />
            <Button
                loading={isPending}
                disabled={isPending}
                style={{ marginTop: 10, backgroundColor: colors.orangeColor }}
                mode='contained'
                onPress={() => fetchBookings(dateString)}
            >
                Обчислити
            </Button>

            {bookings ? (
                <View style={{ rowGap: 15, marginTop: 15 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}>
                        <View style={{ borderRadius: 50, width: 40, height: 40, backgroundColor: colors.statusDeposit }} />
                        <Text>Попередній внесок:</Text>
                        <Text> {bookings.deposit} {user?.company.currency}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}>
                        <View style={{ borderRadius: 50, width: 40, height: 40, backgroundColor: colors.statusPaid }} />
                        <Text>Повністю оплачений:</Text>
                        <Text>{bookings.fullpaid} {user?.company.currency}</Text>
                    </View>
                    <Text style={{ marginLeft: 13, fontWeight: '800' }}>Отримані платежі: {bookings.deposit + bookings.fullpaid} {user?.company.currency}</Text>

                    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}>
                        <View style={{ borderRadius: 50, width: 40, height: 40, backgroundColor: colors.statusNoPaid }} />
                        <Text>Відсутність оплати:</Text>
                        <Text>{bookings.no_paid} {user?.company.currency}</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}>
                        <View style={{ borderRadius: 50, width: 40, height: 40, backgroundColor: colors.statusDeposit }} />
                        <Text>Оплата на місці:</Text>
                        <Text>{bookings.payment_on_place} {user?.company.currency}</Text>
                    </View>
                    <Text style={{ marginLeft: 13, fontWeight: '800' }}>Очікувані виплати: {bookings.no_paid + bookings.payment_on_place} {user?.company.currency}</Text>
                    <Divider bold style={{ height: 4 }} />
                    <Text style={{ marginLeft: 13, fontWeight: '800' }}>Загальна вартість: {bookings.no_paid + bookings.payment_on_place + bookings.deposit + bookings.fullpaid} {user?.company.currency}</Text>
                </View>
            ) : (
                <Text>{isStart ? "В даному діапазону не знайдено бронювань" : ""}</Text>
            )}
        </ScrollView>
    )
}
