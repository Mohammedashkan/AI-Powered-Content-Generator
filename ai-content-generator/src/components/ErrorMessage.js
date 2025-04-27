import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background-color: #fadbd8;
  border-left: 4px solid #e74c3c;
  color: #c0392b;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 4px;
`;

const ErrorTitle = styled.h3`
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  margin: 0;
`;

function ErrorMessage({ title = 'Error', message }) {
  return (
    <ErrorContainer>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorText>{message}</ErrorText>
    </ErrorContainer>
  );
}

export default ErrorMessage;