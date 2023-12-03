import { Archivo } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import paleta from "../styles/paletaColores";
import { Menu } from "@/Components/Menu/Menu";
import SalasCard from "@/Components/Salas";
const inter = Archivo({ subsets: ["latin"] });
import { Providers } from "@/Providers";
import { Footer } from "@/Components/Footer";
import "./globals.css";

export const metadata = {
  title: "FunCombat",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} row mx-0`}
        style={{ background: paleta.NEGRO, color: paleta.BLANCO }}
      >
        {/* Provider   */}
        <Providers>
          <div className="col-12 col-md-2">
            <Menu />
          </div>
          <div className="col-12  col-lg-10 me-sm-0 semMarginRow ">
            <SalasCard />
            {children}
          </div>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
