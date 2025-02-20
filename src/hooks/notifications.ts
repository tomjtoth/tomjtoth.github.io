import { useModal } from ".";

export function useNotify() {
  const modal = useModal();

  return (title: string, body: string) =>
    new Promise<void>((resolve, reject) => {
      if (!window.Notification) {
        modal.ok().prompt("tää selain ei tue ilmoituksia");
        reject();
      } else {
        if (Notification.permission !== "granted") {
          Notification.requestPermission().then((res) => {
            if (res !== "granted") {
              modal.ok().prompt("ilmotiukset on estettyjä");
              reject();
            }
          });
        }

        console.debug("new notification", title, body);
        new Notification(title, { body, icon: "/icon.png" });
        resolve();
      }
    });
}
