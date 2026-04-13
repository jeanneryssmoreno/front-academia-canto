import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'
import type { Class } from '../types/database'

export function useAllClasses() {
    return useQuery({
        queryKey: ['classes'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('classes')
                .select('*, courses(name, level), profiles(full_name, email)')
                .order('start_time', { ascending: true })
            if (error) throw error
            return data
        },
    })
}

export function useStudentClasses(studentId: string | undefined) {
    return useQuery({
        queryKey: ['student-classes', studentId],
        enabled: !!studentId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('enrollments')
                .select('*, classes(*, courses(name, level), profiles(full_name))')
                .eq('student_id', studentId!)
                .order('enrolled_at', { ascending: false })
            if (error) throw error
            return data
        },
    })
}

export function useTeacherClasses(teacherId: string | undefined) {
    return useQuery({
        queryKey: ['teacher-classes', teacherId],
        enabled: !!teacherId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('classes')
                .select('*, courses(name, level)')
                .eq('teacher_id', teacherId!)
                .order('start_time', { ascending: true })
            if (error) throw error
            return data
        },
    })
}

export function useCreateClass() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (cls: Omit<Class, 'id'>) => {
            const { data, error } = await supabase.from('classes').insert(cls).select().single()
            if (error) throw error
            return data
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }),
    })
}

export function useUpdateClassStatus() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: Class['status'] }) => {
            const { error } = await supabase.from('classes').update({ status }).eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classes'] })
            qc.invalidateQueries({ queryKey: ['teacher-classes'] })
        },
    })
}

export function useUpdateClass() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, ...fields }: Partial<Class> & { id: string }) => {
            const { error } = await supabase.from('classes').update(fields).eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classes'] })
            qc.invalidateQueries({ queryKey: ['teacher-classes'] })
        },
    })
}

export function useDeleteClass() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('classes').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['classes'] })
            qc.invalidateQueries({ queryKey: ['teacher-classes'] })
            qc.invalidateQueries({ queryKey: ['student-classes'] })
            qc.invalidateQueries({ queryKey: ['available-classes'] })
        },
    })
}
