import { useRouter } from "next/navigation";

export const useRedirectApp = () => {
  const router = useRouter();

  return {
    IrPara: (url = "/Salas") => router.push(url),
  };
};
