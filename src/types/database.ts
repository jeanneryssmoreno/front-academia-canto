export type UserRole = 'student' | 'teacher' | 'admin'
export type ClassStatus = 'scheduled' | 'cancelled' | 'completed'
export type PaymentStatus = 'pending' | 'paid'

export interface Profile {
    id: string
    full_name: string
    email: string
    role: UserRole
    avatar_url: string | null
    created_at: string
}

export interface Course {
    id: string
    name: string
    description: string | null
    level: string | null
    created_at: string
}

export interface Class {
    id: string
    course_id: string | null
    teacher_id: string | null
    start_time: string
    end_time: string
    status: ClassStatus | null
    meeting_link: string | null
}

export interface ClassWithDetails extends Class {
    courses?: Course | null
    profiles?: Profile | null
}

export interface Enrollment {
    id: string
    student_id: string | null
    class_id: string | null
    enrolled_at: string
}

export interface EnrollmentWithClass extends Enrollment {
    classes?: ClassWithDetails | null
}

export interface Payment {
    id: string
    student_id: string | null
    amount: number
    status: PaymentStatus | null
    due_date: string
    paid_at: string | null
    created_at: string
}

export interface PaymentWithProfile extends Payment {
    profiles?: Profile | null
}

export interface TeacherMetadata {
    id: string
    bio: string | null
    specialty: string | null
    hourly_rate: number | null
}

export interface TeacherWithMeta extends Profile {
    teachers_metadata?: TeacherMetadata | null
}
