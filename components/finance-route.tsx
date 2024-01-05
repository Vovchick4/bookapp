import { ScrollView, View } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { DatePickerInput } from 'react-native-paper-dates';
import { useFinancesReport } from '../contexts/finances-report';
import { useAppTheme } from '../providers/with-react-paper-ui/with-react-paper-ui';

export default function FinanceRoute() {
    const { colors } = useAppTheme();
    const { bookings, dateString, onChangeDate, fetchBookings, isPending, isStart } = useFinancesReport();

    return (
        <ScrollView style={{ padding: 15 }}>
            <DatePickerInput
                mode='flat'
                locale="en"
                label="З"
                inputMode="start"
                value={dateString.start_date}
                onChange={(value) => onChangeDate('start_date', value)}
            />
            <DatePickerInput
                mode='flat'
                locale="en"
                label="До"
                inputMode="start"
                value={dateString.end_date}
                onChange={(value) => onChangeDate('end_date', value)}
            />
            <Button
                loading={isPending}
                disabled={isPending}
                style={{ marginTop: 10 }}
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
                        <Text> {bookings.deposit} UAH</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}>
                        <View style={{ borderRadius: 50, width: 40, height: 40, backgroundColor: colors.statusPaid }} />
                        <Text>Повністю оплачений:</Text>
                        <Text>{bookings.fullpaid} UAH</Text>
                    </View>
                    <Text style={{ marginLeft: 13, fontWeight: '800' }}>Отримані платежі: {bookings.deposit + bookings.fullpaid} UAH</Text>

                    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}>
                        <View style={{ borderRadius: 50, width: 40, height: 40, backgroundColor: colors.statusNoPaid }} />
                        <Text>Відсутність оплати:</Text>
                        <Text>{bookings.no_paid} UAH</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 15 }}>
                        <View style={{ borderRadius: 50, width: 40, height: 40, backgroundColor: colors.statusDeposit }} />
                        <Text>Оплата на місці:</Text>
                        <Text>{bookings.payment_on_place} UAH</Text>
                    </View>
                    <Text style={{ marginLeft: 13, fontWeight: '800' }}>Очікувані виплати: {bookings.no_paid + bookings.payment_on_place} UAH</Text>
                    <Divider bold style={{ height: 4 }} />
                    <Text style={{ marginLeft: 13, fontWeight: '800' }}>Загальна кількість: {bookings.no_paid + bookings.payment_on_place + bookings.deposit + bookings.fullpaid} UAH</Text>
                </View>
            ) : (
                <Text>{isStart ? "В даному діапазону не знайдено бронювань" : ""}</Text>
            )}
        </ScrollView>
    )
}
