import React from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";

export function PageHeader() {
  const { pathname } = useLocation();

  return (
    <Container>
      <Title>{title[pathname] || "Not Found Page"}</Title>
      {pathname !== "/" && <GoBack to="/">돌아가기</GoBack>}
    </Container>
  );
}

const title: { [pathname: string]: string } = {
  "/": "할 일 목록",
  "/add": "할 일 추가",
  "/detail/1": "할 일 상세",
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1e40ff;
`;
const Title = styled.div`
  padding: 20px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
`;
const GoBack = styled(Link)`
  padding: 20px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  position: absolute;
  left: 20px;
`;
