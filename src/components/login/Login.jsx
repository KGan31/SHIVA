import React, { useState } from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  background-color: #000000;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%; /* Ensure the container takes up the full width of the viewport */
  
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  display: flex;
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.5); 
`;

const FormContainer = styled.div`
  width: 50%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  z-index: 100;
`;

const Overlay = styled.div`
  background: linear-gradient(to right, #020810, #040913, #060b15, #080d17, #0a0f19, #0c111b, #0e131d, #10151f, #121721, #141923, #161b25, #181d27, #1a1f29, #1c212b, #1e232d, #20252f, #222731, #242933, #262b35, #282d37, #2a2f39);
  color: #FFFFFF;
  position: relative;
  height: 100%;
  width: 50%;
  transition: transform 0.6s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
`;

const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #070a0d; /* Adjust border color to match the gradient */
  background-color: #070a0d; /* Adjust background color to match the gradient */
  color: #FFFFFF;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #FFFFFF;
`;

const Login = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <PageContainer>
      <ContentContainer>
        <Container className={isSignIn ? "" : "right-panel-active"}>
          <OverlayContainer style={{ transform: isSignIn ? 'translateX(-100%)' : '' }}>
            <Overlay style={{ transform: isSignIn ? 'translateX(0)' : 'translateX(-100%)' }}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <GhostButton onClick={toggleForm}>Sign Up</GhostButton>
            </Overlay>
            <Overlay style={{ transform: isSignIn ? 'translateX(100%)' : 'translateX(0)' }}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <GhostButton onClick={toggleForm}>Sign In</GhostButton>
            </Overlay>
          </OverlayContainer>
          <FormContainer>
            <Form style={{ transform: isSignIn ? 'translateX(100%)' : 'translateX(0)' }}>
              <h1>{isSignIn ? "Sign in" : "Create Account"}</h1>
              {!isSignIn && (
                <>
                  <Input type="text" placeholder="Name" name="name" />
                </>
              )}
              <Input type="email" placeholder="Email" name="email" />
              <Input type="password" placeholder="Password" name="password" />
              <Button type="submit">{isSignIn ? "Sign In" : "Sign Up"}</Button>
            </Form>
          </FormContainer>
        </Container>
      </ContentContainer>
    </PageContainer>
  );
};

export default Login;
