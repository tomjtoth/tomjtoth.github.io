import { DragEvent } from "react";

type PersonalData = {
  firstname: string;
  lastname: string;
  location: string;
  phone: string;
  email: string;
  born: string;
  sex: string;

  // unprocessed, from the .yaml file
  citizenship: string | string[];
  // used during rendering
  cship: string[][];

  occupation: string | string[];
  languages: Map<string, string>;
};

export type EduDet = {
  degree: string;
  institution: string;
  location: string;
  from: string;
  to: string;
  relevant?: boolean;
  top5?: string[];
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
  fromFiles: (list: FileList) => void;
};
