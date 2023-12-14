import axios from "axios"
import { UserEntity } from "../types/user.entity";

export const getUser = async () => {
    return (await axios.get('/auth/get')).data;
}

export const loginUser = async (data: Omit<UserEntity, "id" | "name" | "remember_token">) => {
    return (await axios.post('/auth/login', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}

export const registerUser = async (data: Omit<UserEntity, "id" | "remember_token">) => {
    return (await axios.post('/auth/register', JSON.stringify(data), { headers: { 'Content-Type': 'application/json', } })).data;
}