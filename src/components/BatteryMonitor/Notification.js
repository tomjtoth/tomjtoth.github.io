export function show_notification(body) {
  new Notification("Akunvalvonta", { body });
}

export async function check_permission() {
  if (!window.Notification) {
    alert("notifications are not supported");
    return false;
  } else {
    if (Notification.permission !== "granted") {
      if ((await Notification.requestPermission()) === "granted") {
        this.show_notification("sample notification");
      } else {
        alert("notifications are blocked");
        return false;
      }
    }
  }
  return true;
}
