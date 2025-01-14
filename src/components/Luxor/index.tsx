import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { useLocation, useNavigate } from "react-router";

import {
  createNewField,
  deleteField,
  fieldsFromPreset,
  undo,
  bugCrawlsTo,
  bugRemovePrivacy,
  bugResets,
  newNumber,
} from "../../reducers/luxor";
import { ModalType } from "../../types/modal";
import { last } from "../../utils";
import { bugState } from "../../types/luxor";

import "./luxor.css";

import Modal from "../Modal";
import Header from "../Header";
import MainView from "../MainView";
import ControlForm from "./ControlForm";
import Fields from "./Fields";

export default function Luxor() {
  const [modal, setModal] = useState<ModalType>();

  const dispatch = useAppDispatch();
  const { locked, pickedNums, bug } = useAppSelector((s) => s.luxor);

  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  useEffect(() => {
    const sp = new URLSearchParams(search);
    const preset = sp.get("preset");
    if (preset) {
      dispatch(fieldsFromPreset(preset));
      navigate(pathname);
    }
  }, []);

  return (
    <>
      <Modal {...{ modal, setModal }} />
      <Header title="Luxor" icon="🪲">
        <ControlForm {...{ setModal }} />
      </Header>
      <MainView
        className="luxor"
        onClick={({ target }) => {
          const { tagName, textContent, classList, parentNode } =
            target as HTMLElement;
          if (classList.contains("luxor-fld-add")) {
            dispatch(
              createNewField((parentNode!.parentNode! as HTMLElement).id)
            );
          } else if (classList.contains("luxor-fld-del")) {
            setModal({
              prompt: <>Azt a mezőt most törlöm...</>,
              lang: "hu",
              onSuccess: () =>
                dispatch(
                  deleteField((parentNode!.parentNode! as HTMLElement).id)
                ),
            });
          } else if (locked && tagName === "TD") {
            const asNumber = Number(textContent);
            const num = isNaN(asNumber) ? 0 : asNumber;
            if (!(pickedNums as number[]).includes(num))
              dispatch(newNumber(num));
          }
        }}
      >
        <div
          id="luxor-picked-nums-line"
          onAnimationEnd={(ev) => {
            if (ev.animationName === "luxor-bug-privacy-filter") {
              dispatch(bugCrawlsTo("-10vw"));
              dispatch(bugRemovePrivacy());
            }

            setTimeout(() => {
              dispatch(bugResets());
            }, 710);
          }}
        >
          <span>
            {pickedNums.length === 0 && <>&nbsp;</>}
            {pickedNums.length > 10 && "..."}
            {last(pickedNums, 10).join(", ")}
          </span>
          {bug.privacy && (
            <div id="luxor-num-bug-priv-filter" style={{ left: bug.x }} />
          )}

          {pickedNums.length > 0 && (
            <span
              className="clickable"
              onClick={(e) =>
                setModal({
                  prompt: (
                    <>
                      Törlöm az <strong>utolsó</strong> húzott számot
                    </>
                  ),
                  lang: "hu",
                  onSuccess: () => {
                    dispatch(
                      bugCrawlsTo(
                        (
                          (e.target as HTMLElement)
                            .previousSibling as HTMLElement
                        ).getBoundingClientRect().right - 8
                      )
                    );

                    setTimeout(() => {
                      dispatch(undo());
                    }, 710);
                  },
                })
              }
            >
              ⬅️
            </span>
          )}
          <div
            id="luxor-num-bug"
            className={(bug as bugState).className}
            style={bug.x ? { left: bug.x } : undefined}
          >
            🪲
          </div>
        </div>
        <Fields />
      </MainView>
    </>
  );
}
