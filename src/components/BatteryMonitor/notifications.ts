import { Dispatch } from "@reduxjs/toolkit";

export function notify(body: string) {
  new Notification("Akunvalvonta", { body });
}

export async function checkPermission(setModal: Dispatch) {
  if (!window.Notification) {
    setModal({
      prompt: "ilmoituksia ei tueta",
      buttons: "o",
    });
    return false;
  } else {
    if (Notification.permission !== "granted") {
      if ((await Notification.requestPermission()) === "granted") {
        notify("näyteilmoitus");
      } else {
        setModal({
          prompt: "ilmotiukset on estettyjä",
          buttons: "o",
        });
        return false;
      }
    }
  }
  return true;
}
