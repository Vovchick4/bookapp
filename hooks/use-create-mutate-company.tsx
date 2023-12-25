import { useMutation } from "@tanstack/react-query";
import { createCompany } from "../api";
import { ICompanyEntity, TCreateCompanyPayload } from "../types/user.entity";
import { queryClient } from "../providers/with-react-query/with-react-query";

export default function useCreateMutateCompany() {
    return useMutation<ICompanyEntity, Error, TCreateCompanyPayload>(
        {
            mutationKey: ["createCompany"],
            mutationFn: async (data) => {
                try {
                    const res = (await createCompany(data));
                    // Refetch the useGetQueryUser query after the mutation is successful
                    await queryClient.refetchQueries({ queryKey: ['getUser'] });
                    return res.data
                } catch (error) {
                    throw (error as any).response?.data || { message: 'An error occurred' }
                }
            }
        }
    );
}