"use client";
import { ContextAppProvider } from "@/Context";
import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";
export const Providers = ({ children }) => {
  useEffect(() => {
    clarity.init("k3g8ehl35v");
  }, []);
  return <ContextAppProvider>{children}</ContextAppProvider>;
};
