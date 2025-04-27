import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Add responsive styles to your Header component
const HeaderContainer = styled.header`
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

// Add the Logo component definition
const Logo = styled(Link)`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

// Make sure navigation is responsive
const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    margin-top: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c0392b;
  }
`;

function Header({ user, signOut }) {
  return (
    <HeaderContainer>
      <Logo to="/">AI Content Generator</Logo>
      <Nav>
        <NavLink to="/">Home</NavLink>
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user && <NavLink to="/generator">Generate Content</NavLink>}
        {user && (
          <Button onClick={signOut}>Sign Out</Button>
        )}
      </Nav>
    </HeaderContainer>
  );
}

export default Header;