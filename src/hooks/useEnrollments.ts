import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient'

export function useAvailableClasses() {
    return useQuery({
        queryKey: ['available-classes'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('classes')
                .select('*, courses(name, level, description), profiles(full_name)')
                .eq('status', 'scheduled')
                .order('start_time', { ascending: true })
            if (error) throw error
            return data
        },
    })
}

export function useStudentEnrollments(studentId: string | undefined) {
    return useQuery({
        queryKey: ['enrollments', studentId],
        enabled: !!studentId,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('enrollments')
                .select('class_id')
                .eq('student_id', studentId!)
            if (error) throw error
            return data?.map((e) => e.class_id) ?? []
        },
    })
}

export function useCreateEnrollment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ studentId, classId }: { studentId: string; classId: string }) => {
            const { data, error } = await supabase
                .from('enrollments')
                .insert({ student_id: studentId, class_id: classId })
                .select()
                .single()
            if (error) throw error
            return data
        },
        onSuccess: (_data, vars) => {
            qc.invalidateQueries({ queryKey: ['enrollments', vars.studentId] })
            qc.invalidateQueries({ queryKey: ['student-classes', vars.studentId] })
            qc.invalidateQueries({ queryKey: ['available-classes'] })
        },
    })
}

export function useDeleteEnrollment() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async ({ enrollmentId, studentId }: { enrollmentId: string; studentId: string }) => {
            const { error } = await supabase.from('enrollments').delete().eq('id', enrollmentId)
            if (error) throw error
            return studentId
        },
        onSuccess: (_data, vars) => {
            qc.invalidateQueries({ queryKey: ['enrollments', vars.studentId] })
            qc.invalidateQueries({ queryKey: ['student-classes', vars.studentId] })
        },
    })
}
