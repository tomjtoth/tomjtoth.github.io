import { DragEvent } from "react";

type PersonalData = {
  firstname: string;
  surname: string;
  city: string;
  phone: string;
  email: string;
  born: string;
  sex: string;
  nationality: string;
  languages: Map<string, string>;
};

export type EduDet = {
  title: string;
  school: string;
  city: string;
  from: string;
  to: string;
  top5?: string[];
  relevant?: boolean;
};

export type ExpDet = Omit<EduDet, "school"> & {
  company: string;
  hours?: string;
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
