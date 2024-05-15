export interface IStudentCourses {
    levelTitle: string;
    levelId: string;
    semesterId: string;
    semesterTitle: string;
    sessionId: string;
    sessionTitle: string;
    studentName: string;
    courses: {
      _id: string;
      title: string;
      units: number;
      score: number;
      grade: string;
    }[]
}