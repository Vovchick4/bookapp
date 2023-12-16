import axios from "axios"
import { TLoginPayload, TRegisterPayload, TCreateCompanyPayload } from "../types/user.entity";

export const getUser = async () => {
    return (await axios.get('/auth/get')).data;
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