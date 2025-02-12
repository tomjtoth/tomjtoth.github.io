export type TCxSpinner = {
  active: boolean;
  className?: string;
  show: () => void;
  hide: () => void;
  reset: () => void;
};
