import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import type { Tour, Settlement, IndividualExpenseRecord, Expense } from '@/types';

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: () => apiRequest<Tour[]>('/api/tours/history'),
  });
}

export function useTour(tourId: string) {
  return useQuery({
    queryKey: ['tour', tourId],
    queryFn: () => apiRequest<Tour>(`/api/tours/${tourId}`),
    enabled: !!tourId,
  });
}

export function useSettlements(tourId: string, enabled = true) {
  return useQuery({
    queryKey: ['settlements', tourId],
    queryFn: () => apiRequest<Settlement[]>(`/api/tours/${tourId}/settlements`),
    enabled: !!tourId && enabled,
  });
}

export function useIndividualExpenses(tourId: string, enabled = true) {
  return useQuery({
    queryKey: ['individualExpenses', tourId],
    queryFn: () => apiRequest<IndividualExpenseRecord[]>(`/api/tours/${tourId}/individualExpenses`),
    enabled: !!tourId && enabled,
  });
}

export function useCreateTour() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; members: { name: string }[]; startDate: string }) =>
      apiRequest<Tour>('/api/tours/create', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['tours'] }),
  });
}

export function useUpdateTour(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Tour>) =>
      apiRequest<Tour>(`/api/tours/${tourId}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tours'] });
      qc.invalidateQueries({ queryKey: ['tour', tourId] });
    },
  });
}

export function useEndTour(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest(`/api/tours/${tourId}/end`, { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tours'] });
      qc.invalidateQueries({ queryKey: ['tour', tourId] });
      qc.invalidateQueries({ queryKey: ['settlements', tourId] });
      qc.invalidateQueries({ queryKey: ['individualExpenses', tourId] });
    },
  });
}

export function useReactivateTour(tourId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest(`/api/tours/${tourId}/undoEnd`, { method: 'POST' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tours'] });
      qc.invalidateQueries({ queryKey: ['tour', tourId] });
    },
  });
}

export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      tourId: string;
      paidBy: { memberId: string; name: string };
      amount: number;
      description: string;
      date: string;
      involvedMembers: { memberId: string; name: string }[];
    }) => apiRequest<Expense>('/api/expenses/add', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['tour', vars.tourId] }),
  });
}

export function useUpdateExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId, tourId, ...data }: {
      expenseId: string;
      tourId: string;
      amount: number;
      description: string;
      date: string;
      involvedMembers: { memberId: string; name: string }[];
    }) => apiRequest<Expense>(`/api/expenses/${expenseId}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['tour', vars.tourId] }),
  });
}

export function useDeleteExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId }: { expenseId: string; tourId: string }) =>
      apiRequest(`/api/expenses/${expenseId}`, { method: 'DELETE' }),
    onSuccess: (_, vars) => qc.invalidateQueries({ queryKey: ['tour', vars.tourId] }),
  });
}
