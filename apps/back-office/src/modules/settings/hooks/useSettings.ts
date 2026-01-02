import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import type { SettingsMap } from "../types/setting";
import { toast } from "sonner";

export function useSettings() {
    return useQuery<SettingsMap>({
        queryKey: ["settings"],
        queryFn: async () => {
            const response = await api.get("/settings");
            return response.data;
        },
    });
}

export function useUpdateSetting() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (setting: { key: string; value: string }) => {
            const response = await api.post("/settings", setting);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast.success("Configuração atualizada!");
        },
        onError: () => {
            toast.error("Erro ao atualizar configuração.");
        },
    });
}
