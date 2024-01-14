import { View, ScrollView } from "react-native"
import { DataTable, Text } from "react-native-paper"

import { EventStatus } from "../types/event.entity";
import { TDetails, useFinancesReport } from "../contexts/finances-report"

const getFinalPricesDetail = (data: TDetails, status: EventStatus, key: string) => {
    if (!Object.keys(data) && !Object.keys(data).reduce) {
        return 0;
    }
    return Object.keys(data).reduce((prev, next) => {
        return prev + data[next].bookings[status].reduce((pr, nx) => (pr + nx[key]), 0)
    }, 0)
}

export default function DetailRoute() {
    const { detail, isStart } = useFinancesReport();

    if (!detail) {
        return <ScrollView><Text>{isStart ? "В даному діапазону не знайдено бронювань" : "Виберіть обчислення"}</Text></ScrollView>
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title numberOfLines={2}>Кімната</DataTable.Title>
                        <DataTable.Title numberOfLines={3}>Попередній внесок</DataTable.Title>
                        <DataTable.Title numberOfLines={2}>Повністю оплачений</DataTable.Title>
                        <DataTable.Title numberOfLines={2}>Очікувані виплати</DataTable.Title>
                        <DataTable.Title numberOfLines={2}>Загальна кількість</DataTable.Title>
                    </DataTable.Header>
                    {Object.keys(detail).map((key) => (
                        <DataTable.Row key={key}>
                            <DataTable.Cell>{detail[key].name}</DataTable.Cell>
                            <DataTable.Cell>{detail[key].bookings['deposit'].reduce((pr, nx) => (pr + nx.down_payment), 0)}</DataTable.Cell>
                            <DataTable.Cell>{detail[key].bookings['fullpaid'].reduce((pr, nx) => (pr + nx.final_price), 0)}</DataTable.Cell>
                            <DataTable.Cell>{detail[key].bookings['nopaid'].reduce((pr, nx) => (pr + nx.final_price), 0) + detail[key].bookings['deposit'].reduce((pr, nx) => (pr + nx.payment_on_place), 0)}</DataTable.Cell>
                            <DataTable.Cell>{
                                detail[key].bookings['deposit'].reduce((pr, nx) => (pr + nx.down_payment), 0) +
                                detail[key].bookings['fullpaid'].reduce((pr, nx) => (pr + nx.final_price), 0) +
                                detail[key].bookings['nopaid'].reduce((pr, nx) => (pr + nx.final_price), 0) + + detail[key].bookings['deposit'].reduce((pr, nx) => (pr + nx.payment_on_place), 0)
                            }
                            </DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
            </ScrollView>
            <DataTable.Header>
                <DataTable.Title numberOfLines={2}>Загальна кількість</DataTable.Title>
                <DataTable.Title>
                    {getFinalPricesDetail(detail, EventStatus.deposit, 'down_payment')}
                </DataTable.Title>
                <DataTable.Title>
                    {getFinalPricesDetail(detail, EventStatus.fullpaid, 'final_price')}
                </DataTable.Title>
                <DataTable.Title>
                    {getFinalPricesDetail(detail, EventStatus.nopaid, 'final_price') + getFinalPricesDetail(detail, EventStatus.deposit, 'payment_on_place')}
                </DataTable.Title>
                <DataTable.Title>
                    {getFinalPricesDetail(detail, EventStatus.deposit, 'down_payment') +
                        getFinalPricesDetail(detail, EventStatus.fullpaid, 'final_price') +
                        getFinalPricesDetail(detail, EventStatus.nopaid, 'final_price') + getFinalPricesDetail(detail, EventStatus.deposit, 'payment_on_place')}
                </DataTable.Title>
            </DataTable.Header>
        </View>
    )
}
