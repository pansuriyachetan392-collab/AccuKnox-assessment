import { useEffect } from "react";

export function useOnClickOutside(ref, handler, active) {
  useEffect(() => {
    if (!active) return undefined;

    const onPointer = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };

    const onKey = (event) => {
      if (event.key === "Escape") handler();
    };

    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, handler, active]);
}
