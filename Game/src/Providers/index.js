"use client";
import { ContextAppProvider } from "@/Context";
import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";
import facebookPixel from "react-facebook-pixel";
import { ID_MICROSOFT_CLARITY, PIXEL_FACEBOOK_ID } from "@/Api";
import { useSelectedLayoutSegment } from "next/navigation";

export const Providers = ({ children }) => {
  useEffect(() => {
    clarity.init(ID_MICROSOFT_CLARITY);
    facebookPixel.init(PIXEL_FACEBOOK_ID);
    facebookPixel.pageView();
  }, []);
  const activeSegment = useSelectedLayoutSegment();
  useEffect(() => {
    facebookPixel.pageView();
  }, [activeSegment]);
  return <ContextAppProvider>{children}</ContextAppProvider>;
};
