import { useContext, useState, createContext } from "react";
import { addDays } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import { getUserFinancesReport } from '../api';
import { EventStatus, IEventEntity } from '../types/event.entity';
import { Alert } from "react-native";

interface FinancesProviderProps {
    children: JSX.Element
}

interface FinancesContextData {
    dateString: TDateString
    isStart: boolean
    detail: TDetails | null | undefined
    bookings: TPrices | null | undefined
    fetchBookings: UseMutateFunction<{
        finance: TPrices | null;
        detail: TDetails | null;
    }, Error, TDateString, unknown>
    isPending: boolean
    onChangeDate: (key: string, value: Date | undefined) => void
}

export type TDateString = {
    start_date: Date | undefined,
    end_date: Date | undefined
}

export type TFormatedData = {
    [EventStatus.fullpaid]: IEventEntity[],
    [EventStatus.deposit]: IEventEntity[]
    [EventStatus.nopaid]: IEventEntity[]
    [EventStatus.canceled]: IEventEntity[]
}

export type TPrices = {
    deposit: number;
    fullpaid: number;
    no_paid: number;
    payment_on_place: number;
}

export type TDetails = {
    [roomId: number | string]: {
        id: number | string;
        name: string;
        bookings: TFormatedData;
    };
}

const FinancesContext = createContext<FinancesContextData>({} as FinancesContextData);

const targetTimeZone = 'Europe/Kiev';

const getPriceByCategory = (data: any, key: string, status: string) => {
    if (!data[status] || !data[status]?.reduce) {
        return 0;
    }
    return data[status].reduce((prev: any, current: any) => {
        return prev + current[key];
    }, 0)
}

export function useFinancesReport() {
    return useContext(FinancesContext);
}

export function FinancesProvider({ children }: FinancesProviderProps) {
    const [isStart, setIsStart] = useState(false);
    const { data, mutate, isPending } = useMutation<{ finance: TPrices | null, detail: TDetails | null }, Error, TDateString>({
        mutationKey: ['get-report'],
        mutationFn: async (dates) => {
            try {
                setIsStart(true);
                const res: IEventEntity[] = (await getUserFinancesReport(dates)).data
                const formatedData = res && res.length > 0 ? res.reduce((prev, current) => {
                    if (!prev[current.status]) {
                        prev[current.status] = [];
                    }

                    prev[current.status].push(current);

                    return prev;
                }, {} as TFormatedData) : null

                const finance: TPrices | null = formatedData ? {
                    deposit: getPriceByCategory(formatedData, "down_payment", "deposit"),
                    fullpaid: getPriceByCategory(formatedData, "final_price", "fullpaid"),
                    no_paid: getPriceByCategory(formatedData, "final_price", "nopaid"),
                    payment_on_place: getPriceByCategory(formatedData, "payment_on_place", "deposit")
                } : null

                const detail = res && res.length > 0 ? res.reduce((prev, current) => {
                    const roomId = current.rooms.id;
                    if (!prev[roomId]) {
                        prev[roomId] = {
                            id: roomId,
                            name: current.rooms.name,
                            bookings: {
                                [EventStatus.fullpaid]: [],
                                [EventStatus.deposit]: [],
                                [EventStatus.nopaid]: [],
                                [EventStatus.canceled]: [],
                            },
                        };
                    }

                    prev[roomId].bookings[current.status].push(current);

                    return prev;
                }, {} as TDetails) : null;

                return { finance, detail }
            } catch (error) {
                Alert.alert(
                    "Помилка!",
                    (error as Error).message || "",
                    [{ text: "OK" }]
                )
                // console.log("🚀 ~ file: finances-report.tsx:74 ~ mutationFn: ~ res:", error)
                throw (error as any).response?.data || { message: 'An error occurred' }
            }
        }
    })
    const [dateString, setDateString] = useState<TDateString>
        ({
            start_date: new Date(format(utcToZonedTime(new Date(), targetTimeZone), 'yyyy-MM-dd')),
            end_date: addDays(new Date(format(utcToZonedTime(new Date(), targetTimeZone), 'yyyy-MM-dd')), 1)
        });

    const onChangeDate = (key: string, value: Date | undefined) => {
        setDateString(prev => ({ ...prev, [key]: new Date(format(utcToZonedTime(value || new Date(), targetTimeZone), 'yyyy-MM-dd')) }))
    }

    return (
        <FinancesContext.Provider value={{ isStart, detail: data?.detail, bookings: data?.finance, fetchBookings: mutate, isPending, dateString, onChangeDate }}>
            {children}
        </FinancesContext.Provider>
    )
}