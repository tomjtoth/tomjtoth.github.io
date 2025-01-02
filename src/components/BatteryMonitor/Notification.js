export function notify(body) {
  new Notification("Akunvalvonta", { body });
}

export async function checkPermission() {
  if (!window.Notification) {
    alert("notifications are not supported");
    return false;
  } else {
    if (Notification.permission !== "granted") {
      if ((await Notification.requestPermission()) === "granted") {
        notify("sample notification");
      } else {
        alert("notifications are blocked");
        return false;
      }
    }
  }
  return true;
}
