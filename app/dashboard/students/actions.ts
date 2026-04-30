"use server";

import { db } from "@/db";
import { students } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createStudentAction(data: any) {
  try {
    await db.insert(students).values({
      name: data.basicInfo.name,
      rollNo: data.basicInfo.rollNo,
      department: data.basicInfo.department,
      section: data.basicInfo.section,
      academicRecords: data.subjects,
    });
    
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating student:", error);
    return { success: false, error: error.message };
  }
}
