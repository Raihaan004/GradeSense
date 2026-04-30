import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  rollNo: text('roll_no').notNull().unique(),
  department: text('department').notNull(),
  section: text('section').notNull(),
  academicRecords: jsonb('academic_records'), // Stores the subjects and their assignments, cats, cycle tests
  createdAt: timestamp('created_at').defaultNow(),
});

export const riskProfiles = pgTable('risk_profiles', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').references(() => students.id, { onDelete: 'cascade' }).notNull(),
  predictedRiskScore: integer('predicted_risk_score'),
  isAtRisk: boolean('is_at_risk').default(false),
  lastAnalyzedAt: timestamp('last_analyzed_at').defaultNow(),
});
