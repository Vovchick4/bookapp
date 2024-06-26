import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api";
import { useAuth } from "../contexts/auth";
import { TLoginPayload, IUserEntity } from "../types/user.entity";
import { queryClient } from "../providers/with-react-query/with-react-query";

export default function useLoginMutateUser() {
    const { signIn } = useAuth();

    return useMutation<IUserEntity, Error, TLoginPayload>(
        {
            mutationKey: ["loginUser"],
            mutationFn: async (data) => {
                try {
                    const res = (await loginUser(data));
                    await signIn(res.data);
                    await queryClient.refetchQueries({ queryKey: ['get-rooms'] });
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            }
        }
    );
}