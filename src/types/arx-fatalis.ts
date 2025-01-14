import { RE } from "../components/ArxFatalis/config";

export type State = {
  score: number;
  castSpells: number[];
};

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

export type useLogicProps = {
  queue: RE[];
  setQueue: setQueueType;
  noti: Noti;
  setNoti: setNotiType;
};
