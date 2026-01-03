import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import type { Contract } from "../../employees/types/employee";

export function useContracts(employeeId?: number) {
    return useQuery<Contract[]>({
        queryKey: employeeId ? ["contracts", "employee", employeeId] : ["contracts"],
        queryFn: async () => {
            const url = employeeId ? `/contracts/employee/${employeeId}` : "/contracts";
            const response = await api.get(url);
            return response.data;
        },
    });
}

export function useCreateContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Contract>) => {
            const response = await api.post("/contracts", data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            queryClient.invalidateQueries({ queryKey: ["contracts", "employee", data.employeeId] });
            queryClient.invalidateQueries({ queryKey: ["employees", data.employeeId] });
        },
    });
}

export function useUpdateContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Contract> & { id: number }) => {
            const response = await api.put(`/contracts/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            queryClient.invalidateQueries({ queryKey: ["contracts", "employee", data.employeeId] });
        },
    });
}

export function useDeleteContract() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete(`/contracts/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contracts"] });
            // Ideally we'd know the employeeId here, but we can invalidate all for safety
            queryClient.invalidateQueries({ queryKey: ["contracts", "employee"] });
        },
    });
}
