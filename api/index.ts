import axios from "axios"

import { TDateString } from "../contexts/finances-report";
import { TCreateRoomPayload } from "../types/room.entity";
import { TCreateEventPayload } from "../types/event.entity";
import { TLoginPayload, TRegisterPayload, TCreateCompanyPayload, TUserUpdatePayload, TCompanyUpdatePayload, TEmployeeCreatePayload } from "../types/user.entity";

export const getUser = async () => {
    return (await axios.get('/auth/get')).data;
}

export const getUserFinancesReport = async (dates: TDateString) => {
    return (await axios.get('/user/get-report', { params: dates })).data;
}

export const changePassUser = async (data: { password: string, new_password: string }) => {
    return (await axios.post('/user/change-pass', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })).data;
}

export const resetPassUser = async (data: { email: string }) => {
    return (await axios.post('/user/reset-pass', JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })).data;
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

// Sources
export const getSources = async () => {
    return (await axios.get('/sources/get')).data;
}

export const createSource = async (data: { name: string }) => {
    return (await axios.post('/sources/create', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
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
    return (await axios.post('/calendar/book-create', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const updateRoom = async (data: TCreateRoomPayload, roomId: number | string) => {
    return (await axios.put(`/calendar/room-update/${roomId}`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const updateEvent = async (data: TCreateEventPayload, bookId: number | string) => {
    return (await axios.put(`/calendar/book-update/${bookId}`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const deleteRoom = async (roomId: number | string) => {
    return (await axios.delete(`/calendar/room-delete/${roomId}`, { headers: { 'Content-Type': 'application/json', } })).data;
}

export const deleteEvent = async (bookId: number | string) => {
    return (await axios.delete(`/calendar/book-delete/${bookId}`, { headers: { 'Content-Type': 'application/json', } })).data;
}

// Employee
export const createEmployee = async (data: TEmployeeCreatePayload) => {
    return (await axios.post('/employee/create', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const updateEmployee = async (data: TEmployeeCreatePayload, employeeId: number | string) => {
    return (await axios.put(`/employee/update/${employeeId}`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const deleteEmployee = async (employeeId: number | string) => {
    return (await axios.delete(`/employee/delete/${employeeId}`, { headers: { 'Content-Type': 'application/json', } })).data;
}

export const getEmployeeById = async (employeeId: number | string) => {
    return (await axios.get(`/employee/get-employee/${employeeId}`)).data;
}

export const getEmployees = async () => {
    return (await axios.get(`/employee/get-employees`)).data;
}

export const changePositionBook = async (data: { roomId: number | string, bookId: number | string }) => {
    return (await axios.post('/room/change-position', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}
