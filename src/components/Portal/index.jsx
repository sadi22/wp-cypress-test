import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ({ children }) {
  const mount = document.getElementById("crm-portal");
  const el = document.createElement("div");

  useEffect(() => {
    mount.appendChild(el);
    return () => mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
}
