export type TStudentValues = {
  name: string;
  mobile: string;
  email: string;
  rollNumber: string;
  password: string;
  image: File;
  _id?: string;
};

export const AddStudentValues: TStudentValues = {
  name: "",
  mobile: "",
  email: "",
  rollNumber: "",
  password: "",
  image: new File([], ""),
  _id: "",
};
