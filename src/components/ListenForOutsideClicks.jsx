import { useEffect } from "react";

export default function ListenForOutsideClicks(listening, setListening, menuRef, setIsOpen) {
    return () => {
        if (listening) return
        if (!menuRef.current) return
        setListening(true);
        [`click`, `touchstart`].forEach((type) => {
            document.addEventListener(`click`, (evt) => {
                const cur = menuRef.current
                const node = evt.target
                if (cur?.contains(node)) return
                setIsOpen(false)
            })
        })
    }
}

export function useOutsideAlerter(ref, setIsOpen ) {
    useEffect(() => {
      
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(false)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }