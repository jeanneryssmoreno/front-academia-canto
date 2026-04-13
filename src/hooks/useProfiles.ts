import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Profile } from '../types/database'

export function useProfiles() {
    return useQuery({
        queryKey: ['profiles'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            return data as Profile[]
        },
    })
}

export function useUpdateProfile() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, ...fields }: Partial<Profile> & { id: string }) => {
            const { error } = await supabase.from('profiles').update(fields).eq('id', id)
            if (error) throw error
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['profiles'] }),
    })
}

export function useUpdateRole() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, role }: { id: string; role: string }) => {
            const { error } = await supabase.from('profiles').update({ role }).eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['profiles'] })
            qc.invalidateQueries({ queryKey: ['teachers'] })
            qc.invalidateQueries({ queryKey: ['students'] })
        },
    })
}

export function useTeachers() {
    return useQuery({
        queryKey: ['teachers'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*, teachers_metadata(*)')
                .eq('role', 'teacher')
            if (error) throw error
            return data
        },
    })
}

export function useStudents() {
    return useQuery({
        queryKey: ['students'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student')
                .order('created_at', { ascending: false })
            if (error) throw error
            return data as Profile[]
        },
    })
}
