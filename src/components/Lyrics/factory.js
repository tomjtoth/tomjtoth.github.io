import { toggle_active } from "../../reducers/lyrics";

export default function (dispatch, key) {
  return (e) => {
    dispatch(toggle_active(key));
    e.stopPropagation();
  };
}
