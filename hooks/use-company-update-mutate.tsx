import { useMutation } from "@tanstack/react-query";
import { updateCompany } from "../api";
import { IUserEntity, TCompanyUpdatePayload } from "../types/user.entity";
import { queryClient } from "../providers/with-react-query/with-react-query";

export default function useCompanyUpdateMutate() {
    return useMutation<IUserEntity, Error, TCompanyUpdatePayload>(
        {
            mutationKey: ["update-company"],
            mutationFn: async (data) => {
                try {
                    const res = (await updateCompany(data));
                    await queryClient.refetchQueries({ queryKey: ['get-user'] });
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            }
        }
    );
}
