import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.fullHeight ? '100vh' : '200px'};
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #3498db;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-left: 1rem;
  color: #7f8c8d;
`;

function Loading({ text = 'Loading...', fullHeight = false }) {
  return (
    <LoadingContainer fullHeight={fullHeight}>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
}

export default Loading;