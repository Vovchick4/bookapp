import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { useContext, useState, useEffect, createContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { UserEntity } from "../types/user.entity";

interface AuthProviderProps {
    children: JSX.Element;
}

interface AuthContextData {
    user: UserEntity | null;
    // loading: boolean;
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

    useEffect(() => {
        getUserFromStorage();
    }, []);

    function fillUser(data: UserEntity) {
        setUser(data);
    }

    async function getUserFromStorage() {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function signIn(newUser: UserEntity) {
        try {
            await SecureStore.setItemAsync('token', newUser.remember_token);
            axios.defaults.headers.authorization = `${newUser.remember_token}`;
            await AsyncStorage.setItem('userData', JSON.stringify(newUser));
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
            await AsyncStorage.removeItem('userData');
        } catch (error) {
            setUser(null);
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            // loading: isLoading,
            signIn,
            signOut,
            fillUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}