import { IRoomEntity } from "./room.entity"

export interface IEventEntity {
    [key: string]: any
    id: number | string
    name: string
    room_id: number | string
    start_date: Date
    end_date: Date
    parents: number
    childrens: number
    status: EventStatus,
    phone: string
    email: string
    street: string
    house_number: string
    apartment_number: string
    city: string
    country: string
    post_code: string
    passport: string
    price_per_person: number
    price_per_day: number
    final_price: number
    down_payment: number
    down_payment_date: Date
    payment_on_place: number
    notes: string,
    rooms: IRoomEntity
    sources_id: string
    sources?: ISources
}

export interface ISources {
    id: string
    name: string
    icon: {
        path: string
    }
}

export enum EventStatus {
    fullpaid = "fullpaid",
    deposit = "deposit",
    nopaid = "nopaid",
    canceled = "canceled"
}

export type TCreateEventPayload = Omit<IEventEntity, "id" | "rooms">
