export { isCV } from "./isCV";

export type PersonalData = {
  firstname: string;
  lastname: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  born: string;
  sex: string;
  occupation?: string[];
  citizenship: {
    flag: string;
    nationality: string;
  }[];
  languages: {
    flag: string;
    lang: string;
  }[];
  intro?: string;
  hobbies?: string[];
};

export type EduDet = {
  degree: string;
  institution: string;
  location: string;
  from: string;
  to: string;
  relevant?: boolean;
  highlights?: string[];
};

export type ExpDet = Omit<EduDet, "degree" | "institution"> & {
  title: string;
  employer: string;
  hours?: string;
};

export type TCV = {
  personal: PersonalData;
  experience: ExpDet[];
  education: EduDet[];
  skills: string[];
};

export type ReducerState = {
  img: string;
  cv?: TCV;
  url?: string;
};

export type DetailsProps = {
  exp: boolean;
};
