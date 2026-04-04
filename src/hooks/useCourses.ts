import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Course } from '../types/database'

export function useCourses() {
    return useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            return data as Course[]
        },
    })
}

export function useCreateCourse() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (course: Omit<Course, 'id' | 'created_at'>) => {
            const { data, error } = await supabase.from('courses').insert(course).select().single()
            if (error) throw error
            return data as Course
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
    })
}

export function useUpdateCourse() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, ...fields }: Partial<Course> & { id: string }) => {
            const { error } = await supabase.from('courses').update(fields).eq('id', id)
            if (error) throw error
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
    })
}

export function useDeleteCourse() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('courses').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }),
    })
}
