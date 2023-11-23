import styled from "styled-components";

export const BoxImagenContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;

  input[type="checkbox"] {
    opacity: 0;
    width: 0;
  }
  img {
    cursor: pointer;
    transform: scale(0.95);
    border-radius: 10%;
  }
  position: relative;
  .Selecionado {
    img {
      transform: scale(1);
      border: 5px solid #0d6efd;
     
    }
  }
`;
