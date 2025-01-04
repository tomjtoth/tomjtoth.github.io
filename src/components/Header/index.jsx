import { useDispatch } from "react-redux";

import "./header.css";

import { setDocTitleIcon } from "../../utils";
import { setSidepanel } from "../../reducers/sidepanel";

export default function ({ title, icon, children, ...props }) {
  setDocTitleIcon(title, icon);

  const dispatch = useDispatch();

  return (
    <div
      {...{
        ...props,
        id: "header",
        className: "border1-s",

        onClick: ({ target }) => {
          if (target.classList.contains("toggler")) {
            dispatch(setSidepanel(true));
          }
        },
      }}
    >
      <span id="menu-button" className="toggler clickable padded">
        &#x2630;
      </span>
      {children}
    </div>
  );
}
