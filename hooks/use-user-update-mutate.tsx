import { useMutation } from "@tanstack/react-query";

import { updateUser } from "../api";
import { IUserEntity, TUserUpdatePayload } from "../types/user.entity";
import { queryClient } from "../providers/with-react-query/with-react-query";

export default function useUserUpdateMutate() {
    return useMutation<IUserEntity, Error, TUserUpdatePayload>(
        {
            mutationKey: ["update-user"],
            mutationFn: async (data) => {
                try {
                    const res = (await updateUser(data));
                    await queryClient.refetchQueries({ queryKey: ['get-user'] });
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            }
        }
    );
}
