export interface IStudent {
  id: string;
  firstName: string;
  lastName: string;
  matricNo: string;
  yearEnrolled: number;
  levelAtEnrollment: number;
  semesterGPA: number; // will be calculated from the grades
  CGPA: number; // will be calculated from the grades
  createdAt: Date;
  updatedAt: Date;
}