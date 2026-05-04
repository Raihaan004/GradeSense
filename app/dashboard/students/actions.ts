"use server";

import { db } from "@/db";
import { students, riskProfiles } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createStudentAction(data: any) {
  try {
    // 1. Save student to database
    const [newStudent] = await db.insert(students).values({
      name: data.basicInfo.name,
      rollNo: data.basicInfo.rollNo,
      department: data.basicInfo.department,
      section: data.basicInfo.section,
      academicRecords: data.subjects,
    }).returning({ id: students.id });
    
    // 2. Call Python ML Backend for prediction
    try {
      const mlResponse = await fetch("http://localhost:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjects: data.subjects }),
      });
      
      if (mlResponse.ok) {
        const prediction = await mlResponse.json();
        
        // 3. Save prediction to risk_profiles table
        await db.insert(riskProfiles).values({
          studentId: newStudent.id,
          predictedRiskScore: Math.round(prediction.risk_probability),
          isAtRisk: prediction.is_at_risk,
        });
      } else {
        console.error("ML Backend returned error status:", mlResponse.status);
      }
    } catch (mlError) {
      console.error("Failed to reach Python ML Backend. Ensure it is running on port 8000.", mlError);
    }
    
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating student:", error);
    return { success: false, error: error.message };
  }
}

import { eq, desc } from "drizzle-orm";

export async function getStudentsAction() {
  try {
    const allStudents = await db.select({
      id: students.id,
      name: students.name,
      rollNo: students.rollNo,
      department: students.department,
      section: students.section,
      academicRecords: students.academicRecords,
      predictedRiskScore: riskProfiles.predictedRiskScore,
      isAtRisk: riskProfiles.isAtRisk,
    })
    .from(students)
    .leftJoin(riskProfiles, eq(students.id, riskProfiles.studentId))
    .orderBy(desc(students.createdAt));
    
    return { success: true, data: allStudents };
  } catch (error: any) {
    console.error("Error fetching students:", error);
    return { success: false, data: [] };
  }
}

export async function analyzeStudentAction(student: any) {
  try {
    const mlResponse = await fetch("http://localhost:8000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjects: student.academicRecords, student_name: student.name }),
    });
    
    if (mlResponse.ok) {
      const result = await mlResponse.json();
      return { success: true, data: result };
    } else {
      return { success: false, error: "ML Server returned an error" };
    }
  } catch (error: any) {
    console.error("Failed to fetch ML analysis:", error);
    return { success: false, error: error.message };
  }
}
