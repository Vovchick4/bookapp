import { format } from "date-fns-tz";
import { useContext, useState, useEffect, createContext, useRef } from "react";

interface CalendarProviderProps {
    children: JSX.Element,
}

interface CalendarContextData {
    saveHeaderButtonRef: React.MutableRefObject<null>,
    currentInterval: string,
    isVisibleFullCalendar: boolean,
    openModal: () => void,
    onChangeInterval: (date: Date[], pos: number) => void,
}


const CalendarContext = createContext<CalendarContextData>({} as CalendarContextData);

export function useCalendar() {
    return useContext(CalendarContext);
}

export function CalendarProvider({ children }: CalendarProviderProps) {
    const saveHeaderButtonRef = useRef(null);
    const [currentInterval, setCurrentInterval] = useState('')
    const [isVisibleFullCalendar, setIsVisibleFulliCalendar] = useState(false)

    const onChangeInterval = (date: Date[], pos: number) => {
        setCurrentInterval(`${format(date[pos + 6], 'MMM, yyyy', { timeZone: 'Europe/Kiev' })}`);
        // setCurrentInterval(`${format(date[pos + 1], 'MMM d', { timeZone: 'Europe/Kiev' })} - ${format(date[pos + 6], 'MMM d, yyyy', { timeZone: 'Europe/Kiev' })}`);
    }

    const openModal = () => {
        setIsVisibleFulliCalendar(prev => !prev)
    }

    return (
        <CalendarContext.Provider value={{ saveHeaderButtonRef, isVisibleFullCalendar, currentInterval, openModal, onChangeInterval }}>
            {children}
        </CalendarContext.Provider>
    )
}