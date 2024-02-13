import { IEventEntity } from "./event.entity"

export interface IRoomEntity {
    [key: string]: any
    id: number | string
    name: string
    type: string
    company_id: number | string
    count_room: number
    additional_beds: number
    number_of_single_beds: number
    number_of_double_beds: number
    color: string
    with_color: boolean
    sort_order: number
    bookings: IEventEntity[]
}

export type TCreateRoomPayload = Omit<IRoomEntity, "id" | "company_id" | "bookings">
