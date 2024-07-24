export interface IStudentTranscript {
  firstName: string,
  lastName: string,
  levelAtEnrollment: number,
  matricNo: string,
  yearEnrolled: number,
  cgpa: number
}

interface Course {
  code: string;
  name: string;
  units: number;
}

interface Semester {
  name: string;
}

interface Session {
  name: string;
}

export interface IStudentGrade {
  grade: string;
  course: Course;
  semester: Semester;
  session: Session;
}

export interface IGPASummary {
  [key: string]: {
    [key: string]: {
      gpa: number | null;
      cumHrs: number | null;
      cgpa: number | null;
    } | null;
  };
}
