import axios from "axios"

import { TCreateRoomPayload } from "../types/room.entity";
import { TCreateEventPayload } from "../types/event.entity";
import { TLoginPayload, TRegisterPayload, TCreateCompanyPayload, TUserUpdatePayload, TCompanyUpdatePayload } from "../types/user.entity";

export const getUser = async () => {
    return (await axios.get('/auth/get')).data;
}

export const updateUser = async (data: TUserUpdatePayload) => {
    return (await axios.put('/user/update', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })).data;
}

export const updateCompany = async (data: TCompanyUpdatePayload) => {
    return (await axios.put('/company/update', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })).data;
}

export const loginUser = async (data: TLoginPayload) => {
    return (await axios.post('/auth/login', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const registerUser = async (data: TRegisterPayload) => {
    return (await axios.post('/auth/register', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const createCompany = async (data: TCreateCompanyPayload) => {
    return (await axios.post('/company/create', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

// Calendar api
export const getRooms = async () => {
    return (await axios.get('/calendar/get-rooms')).data
}

export const getRoomsNames = async () => {
    return (await axios.get('/calendar/get-rooms-names')).data
}

export const getRoomById = async (roomId: number | string) => {
    return (await axios.get(`/calendar/get-room/${roomId}`)).data
}

export const getBookById = async (bookId: number | string) => {
    return (await axios.get(`/calendar/get-book/${bookId}`)).data
}

export const createRoom = async (data: TCreateRoomPayload) => {
    return (await axios.post('/calendar/room-create', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const createEvent = async (data: TCreateEventPayload) => {
    console.log("🚀 ~ file: index.ts:53 ~ createEvent ~ data:", data)
    return (await axios.post('/calendar/book-create', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const updateRoom = async (data: TCreateRoomPayload, roomId: number | string) => {
    return (await axios.put(`/calendar/room-update/${roomId}`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const updateEvent = async (data: TCreateEventPayload, bookId: number | string) => {
    console.log("🚀 ~ file: index.ts:62 ~ updateEvent ~ data:", data, bookId)
    return (await axios.put(`/calendar/book-update/${bookId}`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const deleteRoom = async (roomId: number | string) => {
    return (await axios.delete(`/calendar/room-delete/${roomId}`, { headers: { 'Content-Type': 'application/json', } })).data;
}

export const deleteEvent = async (bookId: number | string) => {
    return (await axios.delete(`/calendar/book-delete/${bookId}`, { headers: { 'Content-Type': 'application/json', } })).data;
}