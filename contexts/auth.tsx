import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { useContext, createContext, useState } from "react";

import { UserEntity } from "../types/user.entity";
import useGetQueryUser from "../hooks/use-get-query-user";

interface AuthProviderProps {
    children: JSX.Element;
}

interface AuthContextData {
    user: UserEntity | null;
    loading: boolean;
    signIn: (user: UserEntity) => Promise<void>;
    signOut: () => Promise<void>;
    fillUser: (data: UserEntity) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
    return useContext(AuthContext);
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserEntity | null>(null);

    const { isLoading } = useGetQueryUser();

    function fillUser(data: UserEntity) {
        setUser(data);
    }

    async function signIn(newUser: UserEntity) {
        try {
            await SecureStore.setItemAsync('token', newUser.remember_token);
            axios.defaults.headers.authorization = `Bearer ${newUser.remember_token}`;
            setUser(newUser);
        } catch (error) {
            setUser(null);
            console.log(error);
        }
    }

    async function signOut() {
        try {
            await SecureStore.deleteItemAsync('token');
            axios.defaults.headers.authorization = null;
            setUser(null);
        } catch (error) {
            setUser(null);
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading: isLoading,
            signIn,
            signOut,
            fillUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}