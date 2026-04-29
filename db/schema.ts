import { pgTable, serial, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// Example schema for Student Risk Analyzer
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  clerkId: text('clerk_id'), // To link with Clerk Auth
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  enrollmentDate: timestamp('enrollment_date').defaultNow(),
});

export const riskProfiles = pgTable('risk_profiles', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id).notNull(),
  engagementScore: integer('engagement_score').default(100),
  attendanceRate: integer('attendance_rate').default(100),
  gpa: integer('gpa'), // Represented as GPA * 100
  isAtRisk: boolean('is_at_risk').default(false),
  lastAnalyzedAt: timestamp('last_analyzed_at').defaultNow(),
});
