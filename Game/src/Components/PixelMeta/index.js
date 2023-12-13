"use client";
import { useEffect } from "react";
import { PIXEL_FACEBOOK_ID } from "@/Api";

export const PixelMeta = () => {
  useEffect(() => {
    (async () => {
      const facebookPixel = await import("react-facebook-pixel");
      facebookPixel.default.init(PIXEL_FACEBOOK_ID);
      facebookPixel.default.pageView();
    })();
  });
  return null;
};
