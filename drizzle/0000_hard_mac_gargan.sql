CREATE TABLE "risk_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer NOT NULL,
	"engagement_score" integer DEFAULT 100,
	"attendance_rate" integer DEFAULT 100,
	"gpa" integer,
	"is_at_risk" boolean DEFAULT false,
	"last_analyzed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"enrollment_date" timestamp DEFAULT now(),
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "risk_profiles" ADD CONSTRAINT "risk_profiles_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;