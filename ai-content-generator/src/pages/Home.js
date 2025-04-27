import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Hero = styled.div`
  margin: 3rem 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: #4285f4;
  color: white;
  padding: 0.8rem 1.5rem;
  font-size: 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  margin: 0 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3367d6;
  }
`;

const FeaturesSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 4rem 0;
`;

const FeatureCard = styled.div`
  width: 300px;
  margin: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: left;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #333;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const Home = () => {
  return (
    <HomeContainer>
      <Hero>
        <Title>AI-Powered Content Generator</Title>
        <Subtitle>Create high-quality content in seconds with the power of AI</Subtitle>
        <div>
          <CTAButton to="/signup">Get Started</CTAButton>
          <CTAButton to="/login" style={{ backgroundColor: '#34a853' }}>Login</CTAButton>
        </div>
      </Hero>

      <FeaturesSection>
        <FeatureCard>
          <FeatureTitle>Blog Posts</FeatureTitle>
          <FeatureDescription>
            Generate engaging blog posts on any topic with just a few clicks. Our AI understands context and creates content that reads like it was written by a human.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Marketing Copy</FeatureTitle>
          <FeatureDescription>
            Create compelling marketing copy that converts. From product descriptions to ad copy, our AI helps you craft messages that resonate with your audience.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Social Media</FeatureTitle>
          <FeatureDescription>
            Generate social media posts that engage your followers. Our AI helps you create content that drives likes, comments, and shares across all platforms.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default Home;