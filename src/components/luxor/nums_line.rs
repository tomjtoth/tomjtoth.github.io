use dioxus::prelude::*;

use crate::components::luxor::DiskLuxorNumbers;

#[component]
pub fn PickedNumsLine() -> Element {
    let mut numbers = use_context::<DiskLuxorNumbers>();

    rsx! {}

    //   return (
    //     <div
    //       id="luxor-picked-nums-line"
    //       onAnimationEnd={(ev) => {
    //         if (ev.animationName === "luxor-bug-privacy-filter") {
    //           dispatch(bugCrawlsTo("-10vw"));
    //           dispatch(unblurBug());
    //         }

    //         setTimeout(() => {
    //           dispatch(resetBug());
    //         }, 710);
    //       }}
    //     >
    //       <span>
    //         {pickedNums.length === 0 && <>&nbsp;</>}
    //         {pickedNums.length > 10 && "..."}
    //         {(last(pickedNums, 10) as number[]).join(", ")}
    //       </span>

    //       {bug.privacy && (
    //         <div id="luxor-num-bug-priv-filter" style={{ left: bug.x }} />
    //       )}

    //       {pickedNums.length > 0 && (
    //         <span
    //           className="clickable"
    //           onClick={(e) =>
    //             setModal({
    //               prompt: (
    //                 <>
    //                   Törlöm az <strong>utolsó</strong> húzott számot
    //                 </>
    //               ),
    //               lang: "hu",
    //               onSuccess: () => {
    //                 dispatch(
    //                   bugCrawlsTo(
    //                     (
    //                       (e.target as HTMLElement).previousSibling as HTMLElement
    //                     ).getBoundingClientRect().right - 8
    //                   )
    //                 );

    //                 setTimeout(() => {
    //                   dispatch(rmLastNum());
    //                 }, 710);
    //               },
    //             })
    //           }
    //         >
    //           ⬅️
    //         </span>
    //       )}
    //       <div
    //         id="luxor-num-bug"
    //         className={bug.className}
    //         style={bug.x ? { left: bug.x } : undefined}
    //       >
    //         🪲
    //       </div>
    //     </div>
    //   );
}
