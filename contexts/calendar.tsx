import { useContext, useState, createContext, useRef, useEffect, useTransition } from "react";
import { format } from "date-fns-tz";
import { UseQueryResult } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { IRoomEntity } from "../types/room.entity";
import useGetQueryRooms from "../hooks/use-get-query-rooms";

export enum ECalendarViewType {
    week = "week",
    month = "month",
}

interface CalendarProviderProps {
    children: JSX.Element
}

interface CalendarContextData {
    calendarViewType: ECalendarViewType,
    queryRoom: UseQueryResult<IRoomEntity[], Error>
    saveHeaderButtonRef: React.MutableRefObject<null>,
    currentInterval: string,
    isVisibleFullCalendar: boolean,
    onChangeView: (value: ECalendarViewType) => void,
    openModal: () => void,
    onChangeInterval: (date: Date[], pos: number) => void,
}

export type TSatusColors = {
    [key: string]: string
    fullpaid: string
    deposit: string
    nopaid: string
    canceled: string
}

const CalendarContext = createContext<CalendarContextData>({} as CalendarContextData);

export function useCalendar() {
    return useContext(CalendarContext);
}

export function CalendarProvider({ children }: CalendarProviderProps) {
    const queryRooms = useGetQueryRooms();
    const saveHeaderButtonRef = useRef(null);
    const [currentInterval, setCurrentInterval] = useState('');
    const [isVisibleFullCalendar, setIsVisibleFulliCalendar] = useState(false);
    const [calendarViewType, setCalendarViewType] = useState(ECalendarViewType.week);
    const [isPending, startTransiton] = useTransition();

    useEffect(() => {
        (async () => {
            const calendarViewType = await AsyncStorage.getItem("calendarViewType");
            if (calendarViewType) {
                setCalendarViewType(JSON.parse(calendarViewType));
            }
        })();
    }, [])

    const onChangeInterval = (date: Date[], pos: number) => {
        startTransiton(() => {
            setCurrentInterval(`${format(date[pos + 4], 'MMM, yyyy', { timeZone: 'Europe/Kiev' })}`);
        })
        // setCurrentInterval(`${format(date[pos + 1], 'MMM d', { timeZone: 'Europe/Kiev' })} - ${format(date[pos + 6], 'MMM d, yyyy', { timeZone: 'Europe/Kiev' })}`);
    }

    const openModal = () => {
        setIsVisibleFulliCalendar(prev => !prev)
    }

    const onChangeView = async (value: ECalendarViewType) => {
        try {
            await AsyncStorage.setItem("calendarViewType", value);
            setCalendarViewType(value);
        } catch (err) {
            throw new Error((err as Error).message);
        }
    };

    return (
        <CalendarContext.Provider value={{ calendarViewType, queryRoom: queryRooms, saveHeaderButtonRef, isVisibleFullCalendar, currentInterval, onChangeView, openModal, onChangeInterval }}>
            {children}
        </CalendarContext.Provider>
    )
}