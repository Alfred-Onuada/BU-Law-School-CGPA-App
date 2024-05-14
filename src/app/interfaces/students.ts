export interface IStudent {
  sessionTitle: string;
  sessionId: string;
  semesterId: string;
  semesterTitle: string;
  levelTitle: string;  
  levelId: string;  
  currentPage: number;
  totalPages: number;
  students: {
    _id: string;
    name: string;
    semesterGPA: number;
    CGPA: number;
  }[]
}