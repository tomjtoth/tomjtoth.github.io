type PersonalDetails = {
  firstname: String;
  surname: String;
  residence: String;
  phone: String;
  email: String;
  born: String;
  sex: String;
  nationality: String;
};

type WorkDetails = {
  title: String;
  hours?: string;
  company: String;
  location: String;
  from: String;
  to: String;
  responsibilities: string[];
};

type EducationDetails = {
  name: String;
  from: String;
  to: String;
  institution: String;
  location: String;
  details?: string[];
};

export type CVDetails = {
  personal: PersonalDetails;
  experience: WorkDetails[];
  education: EducationDetails[];
};

export type RedState = {
  cv: CVDetails;
  img?: string;
};

export type UseCV = RedState & {
  fromItems: (list: DataTransferItemList) => void;
  fromFiles: (list: FileList) => void;
};
