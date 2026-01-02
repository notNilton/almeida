import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../lib/api";
import type { HistoryEvent } from "../types/history";

export function useHistory() {
  return useQuery<HistoryEvent[]>({
    queryKey: ["history"],
    queryFn: async () => {
      const response = await api.get("/history");
      return response.data;
    },
  });
}

export function useCreateHistoryEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEvent: Omit<HistoryEvent, "id">) => {
      const response = await api.post("/history", newEvent);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useUpdateHistoryEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<HistoryEvent> & { id: number }) => {
      const response = await api.patch(`/history/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useDeleteHistoryEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/history/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
