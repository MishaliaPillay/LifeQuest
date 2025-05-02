// styles.tsx
"use client";
import styled from "styled-components";
import { Button } from "antd";

export const SignupContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 20px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const StyledButton = styled(Button)`
  height: 45px;
  background: linear-gradient(90deg, #ff6b98 0%, #ff9171 100%);
  border: none;
  border-radius: 6px;
  font-weight: 500;

  &:hover,
  &:focus {
    background: linear-gradient(90deg, #ff5289 0%, #ff8060 100%);
  }
`;
