"use client";

import { useEffect } from "react";

export const useCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(".cursor") as HTMLElement;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
    };

    const handleLinkHover = () => {
      cursor.style.transform = `translate(${cursor.offsetLeft}px, ${cursor.offsetTop}px) scale(2)`;
    };

    const handleLinkLeave = () => {
      cursor.style.transform = `translate(${cursor.offsetLeft}px, ${cursor.offsetTop}px) scale(1)`;
    };

    document.addEventListener("mousemove", moveCursor);

    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkHover);
      link.addEventListener("mouseleave", handleLinkLeave);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkHover);
        link.removeEventListener("mouseleave", handleLinkLeave);
      });
    };
  }, []);
};
