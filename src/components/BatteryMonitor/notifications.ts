import { ModalBuilder } from "../../types/modal";

export function notify(body: string) {
  console.debug("notifying user with", body);
  new Notification("Akunvalvonta", { body, icon: "/icon.png" });
}

export const pluggedInStr = "ja laturi on vieläkin kiinni";
export const unpluggedStr = "eikä laturi oo kytkettynä";

export function notiText(charging: boolean, level: number) {
  return `Akun taso on nyt ${level}% ${charging ? pluggedInStr : unpluggedStr}`;
}

export async function checkPermission(modal: ModalBuilder) {
  if (!window.Notification) {
    modal.ok().prompt("ilmoituksia ei tueta");

    return false;
  } else {
    if (Notification.permission !== "granted") {
      if ((await Notification.requestPermission()) === "granted") {
        notify("näyteilmoitus");
      } else {
        modal.ok().prompt("ilmotiukset on estettyjä");

        return false;
      }
    }
  }
  return true;
}
