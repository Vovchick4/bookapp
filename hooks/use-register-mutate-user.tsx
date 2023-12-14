import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api";
import { useAuth } from "../contexts/auth";
import { UserEntity } from "../types/user.entity";

export default function useRegisterMutateUser() {
    const { signIn } = useAuth();

    return useMutation<UserEntity, Error, Omit<UserEntity, "id" | "remember_token">>(
        {
            mutationKey: ["loginUser"],
            mutationFn: async (data) => {
                try {
                    const res = (await registerUser(data));
                    await signIn(res.data);
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            }
        }
    );
}