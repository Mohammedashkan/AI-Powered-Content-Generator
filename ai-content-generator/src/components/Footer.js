import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  padding: 1rem 2rem;
  background-color: #2c3e50;
  color: white;
  text-align: center;
  margin-top: auto;
  width: 100%;
  box-sizing: border-box;
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 1rem;
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

function Footer() {
  return (
    <FooterContainer>
      <FooterText>© {new Date().getFullYear()} AI Content Generator. All rights reserved by Ashkan.</FooterText>
    </FooterContainer>
  );
}

export default Footer;