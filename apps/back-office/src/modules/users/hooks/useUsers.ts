import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import type { User } from "../types/user";

export function useProfile() {
    return useQuery<User>({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await api.get("/users/profile");
            return response.data;
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<User>) => {
            const response = await api.put("/users/profile", data);
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["profile"], data);
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}

export function useUsers() {
    return useQuery<User[]>({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await api.get("/users");
            return response.data;
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Partial<User> & { id: number }) => {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await api.post("/users", data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, deleteCode }: { id: number; deleteCode: string }) => {
            const response = await api.delete(`/users/${id}`, { data: { deleteCode } });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}
