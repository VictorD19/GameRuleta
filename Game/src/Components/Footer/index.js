import Image from "next/image";
import Logo from "../../Assert/logo.svg";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className=" mt-3">
      <div className="card bg-dark">
        <div className="card-body row align-items-center gap-md-0 gap-3">
          <div className="col-12 col-md-9">
            <div className="d-flex flex-column">
              <Image src={Logo} height={40} alt="logo" />
              <small style={{ color: "#c1c1c1" }} className="mt-2">
                {new Date().getFullYear()} © FunCombat games. All right
                reserved.
              </small>
            </div>
          </div>
          <div className="col-12 col-md-3 d-flex gap-5">
            <div>
              <Link href="/PoliticaPrivacidade">Politica de Privacidad</Link>
            </div>
            <div>
              <Link href="/Faq">Regras do Jogo</Link>
            </div>
            <div className="">
              <Link href="/Contato">Contato</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
