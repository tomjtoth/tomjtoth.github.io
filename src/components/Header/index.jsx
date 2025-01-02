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

        onClick: ({ target }) => {
          if (target.classList.contains("spt")) {
            dispatch(setSidepanel(true));
          } else if (target.closest("#qr-code")) {
            navigator.clipboard.writeText(window.location).then((_) => {
              console.log("text copied");
            });
          }
        },
      }}
    >
      <span id="menu-button" className="spt clickable padded">
        &#x2630;
      </span>
      {children}
    </div>
  );
}
