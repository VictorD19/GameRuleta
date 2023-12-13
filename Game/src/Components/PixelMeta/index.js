"use client";
import facebookPixel from "react-facebook-pixel";
import { useEffect } from "react";
import { PIXEL_FACEBOOK_ID } from "@/Api";

export const PixelMeta = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("react-facebook-pixel")
        .then((x) => x.default)
        .then((reactpixel) => {
          reactpixel.init(PIXEL_FACEBOOK_ID);
          reactpixel.pageView();
        });
    }
  });
  return null;
};
