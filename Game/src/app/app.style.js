import styled from "styled-components";

export const HeadPaginaPrincialStyle = styled.div`
  text-align: center;
  padding: 3rem 0;
  h1 {
    font-weight: 700;
  }
  h5 {
    color: #c1c1c1;
    font-weight: 400;
  }
`;

export const EstaditicasJuegoStyled = styled.div`
  > div {
    background: #1e2632;
    transform: scale(0.95);
    border-top: 0.2rem solid #2e87f4;
  }
  h4 {
    font-size: 2.5rem;
  }
  p {
    color: #c1c1c1;
  }
  .preechimento {
    height: 2rem;
  }
`;

export const CardPasoAPaso = styled.div`
display:flex;
text-align:center;
align-items:center;

margin: 2rem 0;
span{
  padding: 0.8rem 1.25rem;
  height:3rem;
  background: #f29a0b;
  border-radius: 50%;
  margin-right: 0.5rem;
}
h6{
  font-weight: bold;
  margin:0;
  font-size: 1.3em;
  text-transform:uppercase;
  margin-bottom: 0.2rem;
}
p{
  color: #c1c1c1;
  font-size: 1.2em;
  vertical-align:middle;
}



`

export const ContaineCardPaso = styled.div`
   border-top:4px solid #f29a0b;
   gap:1;
@media only screen and (max-width: 767px) {
   border-left:4px solid #f29a0b;
   border-top:none;
  }`