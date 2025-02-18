import { DragEvent } from "react";

type PersonalData = {
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
  summary?: string;
};

export type TCV = {
  personal: PersonalData;
  experience: ExpDet[];
  education: EduDet[];
};

export type RedState = {
  img: string;
  cv?: TCV;
  url?: string;
};

export type UseCV = RedState & {
  onDragEnter: () => void;
  onDrop: (ev: DragEvent<HTMLDivElement>) => void;

  // fromItems: (list: DataTransferItemList) => void;
  fromFiles: (list: FileList) => Promise<void>;
};
