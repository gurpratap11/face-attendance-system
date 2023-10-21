type TAttendanceData = {
  studentID?: ObjectId;
  name: string;
  inTime: Date;
  outTime: Date;
  notes?: string;
  status: string;
  createdAt: Date;
};
