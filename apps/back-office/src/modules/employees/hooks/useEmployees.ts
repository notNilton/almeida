import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import type { Employee } from "../types/employee";

export function useEmployees() {
    return useQuery<Employee[]>({
        queryKey: ["employees"],
        queryFn: async () => {
            const response = await api.get("/employees");
            return response.data;
        },
    });
}

export function useEmployee(id: string) {
    return useQuery<Employee>({
        queryKey: ["employees", id],
        queryFn: async () => {
            const response = await api.get(`/employees/${id}`);
            return response.data;
        },
        enabled: !!id,
    });
}

export function useCreateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Employee>) => {
            const response = await api.post("/employees", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}

export function useUpdateEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<Employee> & { id: string }) => {
            const response = await api.put(`/employees/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            queryClient.invalidateQueries({ queryKey: ["employees", data.id] });
        },
    });
}

export function useDeleteEmployee() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/employees/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}
