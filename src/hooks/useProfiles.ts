import { useQuery } from '@tanstack/react-query'
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
