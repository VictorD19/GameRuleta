import { useRouter } from "next/navigation";

export const useRedirectApp = () => {
  const router = useRouter();

  return {
    IrPara: (url = "/Salas?room=1") => router.push(url),
  };
};
