"use client";
import React, { useState } from "react";
import { Tabs } from "antd";
import styled from "styled-components";
import LoginComponent from "../../components/login/login";
import SignupComponent from "../../components/signup/signup";



const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    rgb(254, 82, 29) 0%,
    rgb(255, 47, 99) 50%,
    rgb(124, 39, 252) 100%
  );
`;

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 40px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }
`;

const RightSide = styled.div`
  flex: 1;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.1);
  padding: 40px 20px;

  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    border-radius: 0;
  }
`;

const Logo = styled.div`
  position: absolute;
  top: 40px;
  left: 40px;
  font-size: 28px;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
`;

const LogoCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 3px solid white;
  margin-right: 5px;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid white;
    left: 10px;
    opacity: 0.8;
  }
`;

const WelcomeText = styled.div`
  color: white;
  text-align: center;
  margin-bottom: 30px;
  z-index: 10;

  h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
    color: white;
  }

  p {
    font-size: 18px;
    max-width: 400px;
    margin: 0 auto;
  }
`;

// Background elements
const Circle = styled.div<{
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  color: string;
}>`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  background: ${(props) => props.color};
  top: ${(props) => props.top || "auto"};
  left: ${(props) => props.left || "auto"};
  right: ${(props) => props.right || "auto"};
  bottom: ${(props) => props.bottom || "auto"};
  opacity: 0.6;
  filter: blur(5px);
  z-index: 1;
`;

const StyledTabs = styled(Tabs)`
  width: 100%;
  max-width: 400px;

  .ant-tabs-nav {
    margin-bottom: 30px;
  }

  .ant-tabs-nav-list {
    width: 100%;
    display: flex;
  }

  .ant-tabs-tab {
    flex: 1;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 12px 0;
    font-size: 16px;
    transition: all 0.3s ease;
    color: #888;
  }

  .ant-tabs-tab-active {
    font-weight: 600;
  }

  .ant-tabs-ink-bar {
    background: linear-gradient(
      90deg,
      rgb(255, 32, 99) 0%,
      rgb(249, 80, 28) 100%
    );
    height: 3px;
    border-radius: 3px;
  }
`;

const AuthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <PageContainer>
      <LeftSide>
        <Logo>
          <LogoCircle />
          Life Quest
        </Logo>

        <WelcomeText>
          <h1>Welcome Page</h1>
          <p>Sign in to continue access to your account and all our features</p>
        </WelcomeText>

        {/* Background elements */}
        <Circle size="150px" top="15%" left="10%" color="#ff9171" />
        <Circle size="100px" top="50%" left="25%" color="#a742ff" />
        <Circle size="200px" bottom="10%" right="15%" color="#ff6b98" />
        <Circle size="70px" top="30%" right="20%" color="#ff9171" />
      </LeftSide>

      <RightSide>
        <StyledTabs
          activeKey={activeTab}
          onChange={handleTabChange}
          centered
          items={[
            {
              label: "Login",
              key: "login",
              children: <LoginComponent />,
            },
            {
              label: "Sign Up",
              key: "signup",
              children: <SignupComponent />,
            },
          ]}
        />
      </RightSide>
    </PageContainer>
  );
};

export default AuthPage;
