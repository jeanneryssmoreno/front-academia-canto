import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useStudentPayments(studentId: string | undefined) {
    return useQuery({
        queryKey: ['payments', studentId],
        enabled: !!studentId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('student_id', studentId!)
                .order('due_date', { ascending: true })
            if (error) throw error
            return data
        },
    })
}

export function useAllPayments() {
    return useQuery({
        queryKey: ['all-payments'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('payments')
                .select('*, profiles(full_name, email)')
                .order('created_at', { ascending: false })
            if (error) throw error
            return data
        },
    })
}

export function useMarkPaymentPaid() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('payments')
                .update({ status: 'paid', paid_at: new Date().toISOString() })
                .eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['all-payments'] })
            qc.invalidateQueries({ queryKey: ['payments'] })
        },
    })
}

export function useCreatePayment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (payment: {
            student_id: string
            amount: number
            due_date: string
            status?: string
        }) => {
            const { data, error } = await supabase.from('payments').insert(payment).select().single()
            if (error) throw error
            return data
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['all-payments'] })
            qc.invalidateQueries({ queryKey: ['payments'] })
        },
    })
}
