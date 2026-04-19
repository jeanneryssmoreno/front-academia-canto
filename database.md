| table_name        | column_name  | data_type                | is_nullable | column_default            |
| ----------------- | ------------ | ------------------------ | ----------- | ------------------------- |
| classes           | id           | uuid                     | NO          | gen_random_uuid()         |
| classes           | course_id    | uuid                     | YES         | null                      |
| classes           | teacher_id   | uuid                     | YES         | null                      |
| classes           | start_time   | timestamp with time zone | NO          | null                      |
| classes           | end_time     | timestamp with time zone | NO          | null                      |
| classes           | status       | USER-DEFINED             | YES         | 'scheduled'::class_status |
| classes           | meeting_link | text                     | YES         | null                      |
| courses           | id           | uuid                     | NO          | gen_random_uuid()         |
| courses           | name         | text                     | NO          | null                      |
| courses           | description  | text                     | YES         | null                      |
| courses           | level        | text                     | YES         | null                      |
| courses           | created_at   | timestamp with time zone | YES         | now()                     |
| enrollments       | id           | uuid                     | NO          | gen_random_uuid()         |
| enrollments       | student_id   | uuid                     | YES         | null                      |
| enrollments       | class_id     | uuid                     | YES         | null                      |
| enrollments       | enrolled_at  | timestamp with time zone | YES         | now()                     |
| payments          | id           | uuid                     | NO          | gen_random_uuid()         |
| payments          | student_id   | uuid                     | YES         | null                      |
| payments          | amount       | numeric                  | NO          | null                      |
| payments          | status       | USER-DEFINED             | YES         | 'pending'::payment_status |
| payments          | due_date     | date                     | NO          | null                      |
| payments          | paid_at      | timestamp with time zone | YES         | null                      |
| payments          | created_at   | timestamp with time zone | YES         | now()                     |
| profiles          | id           | uuid                     | NO          | null                      |
| profiles          | full_name    | text                     | NO          | null                      |
| profiles          | email        | text                     | NO          | null                      |
| profiles          | role         | USER-DEFINED             | YES         | 'student'::user_role      |
| profiles          | avatar_url   | text                     | YES         | null                      |
| profiles          | created_at   | timestamp with time zone | YES         | now()                     |
| teachers_metadata | id           | uuid                     | NO          | null                      |
| teachers_metadata | bio          | text                     | YES         | null                      |
| teachers_metadata | specialty    | text                     | YES         | null                      |
| teachers_metadata | hourly_rate  | numeric                  | YES         | null                      |