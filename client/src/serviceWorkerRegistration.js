import { Workbox } from "workbox-window";

export function register() {
  if (process.env.NODE_ENV !== "production") return;

  if ("serviceWorker" in navigator) {
    const wb = new Workbox(`${process.env.PUBLIC_URL}/service-worker.js`);

    wb.register().catch(() => {});
  }
}
