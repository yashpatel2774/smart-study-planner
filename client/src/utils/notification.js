import API from "../api/axios";

export const subscribeUser = async () => {

  // ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("You must allow notifications");
    return;
  }

  // get service worker
  const registration = await navigator.serviceWorker.ready;

  // convert base64 key
  const publicKey = "BL_TNI4K1yP7Xjs1CX9TZ55listSpbiN-DeCNX6wscbiqatGcWAn30L5oK4ouMvIgSfATRt9tWncenvnstsPnbY";

  const convertedKey = urlBase64ToUint8Array(publicKey);

  // subscribe
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey
  });

  // send to backend
  await API.post("/notifications/subscribe", subscription);

  alert("Notifications Enabled!");
};


// helper
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}