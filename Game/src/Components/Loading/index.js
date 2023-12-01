"use client";
import Image from "next/image";
import styled from "styled-components";
import Loading from "../../Assert/loading.svg";
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(40, 55, 71, 0.7);
  color: white;
  z-index: 9990000;

  .loading-content {
    text-align: center;
  }
`;
export const LoadingComponet = () => {
  return (
    <LoadingContainer className="loading-container">
      <div className="loading-content">
        <Image src={Loading} alt="loading" />
      </div>
    </LoadingContainer>
  );
};
