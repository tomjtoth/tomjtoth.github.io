import { RE } from "./config";

export type Noti =
  | {
      spell: string;
      sequence: string[];
      page: number;
    }
  | undefined;

export type ControlFormProps = {
  noti: Noti;
};

export type setQueueType = React.Dispatch<React.SetStateAction<RE[]>>;
export type setNotiType = React.Dispatch<React.SetStateAction<Noti>>;
