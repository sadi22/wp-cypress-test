import React from "react";

export default function ({ children, elementRef, x = 100, y = 100 }) {
  const xPos = elementRef.current
    ? elementRef.current.getBoundingClientRect().x - 132
    : x;
  const yPos = elementRef.current
    ? elementRef.current.getBoundingClientRect().y + window.scrollY + y
    : y;
  return (
    <div
      style={{
        position: "absolute",
        left: xPos,
        top: yPos,
      }}
    >
      {children}
    </div>
  );
}
