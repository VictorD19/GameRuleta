"use client";
import { ContextAppProvider } from "@/Context";
import { useEffect } from "react";
import { clarity } from "react-microsoft-clarity";
import facebookPixel from "react-facebook-pixel";
import { ID_MICROSOFT_CLARITY, PIXEL_FACEBOOK_ID } from "@/Api";
import { useRouter } from "next/router";
export const Providers = ({ children }) => {
  const router = useRouter();
  useEffect(() => {
    clarity.init(ID_MICROSOFT_CLARITY);
    facebookPixel.init(PIXEL_FACEBOOK_ID);
    facebookPixel.pageView();
    router.events.on("routeChangeComplete", () => {
      facebookPixel.pageView();
    });
  }, []);
  return <ContextAppProvider>{children}</ContextAppProvider>;
};
