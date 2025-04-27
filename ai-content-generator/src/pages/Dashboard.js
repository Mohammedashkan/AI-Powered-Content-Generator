import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #2c3e50;
`;

const CreateButton = styled(Link)`
  background-color: #3498db;
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  &:hover {
    background-color: #2980b9;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ContentCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const ContentTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const ContentType = styled.span`
  background-color: #3498db;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ContentDate = styled.p`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ContentPreview = styled.p`
  color: #34495e;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const EmptyStateTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #7f8c8d;
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

function Dashboard() {
  const { user } = useAuth();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  async function fetchContents() {
    try {
      // In a real app, this would call your backend API
      // const response = await API.get('contentApi', '/contents');
      // setContents(response.items);
      
      // For demo purposes, let's use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockContents = [
        {
          id: '1',
          title: 'The Future of AI in Marketing',
          contentType: 'blog',
          content: 'Artificial intelligence is revolutionizing how companies approach marketing. From personalized recommendations to automated content creation, AI tools are helping marketers work more efficiently and effectively...',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Top 10 Web Development Trends',
          contentType: 'blog',
          content: 'The web development landscape is constantly evolving with new technologies and frameworks. Stay ahead of the curve by keeping an eye on these top 10 trends that are shaping the future of web development...',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'Boost Your Sales with AI',
          contentType: 'marketing',
          content: 'Ready to transform your business? Our AI-powered solutions can help you boost sales, improve customer engagement, and streamline your operations. Don\'t miss out on the competitive advantage that AI can provide...',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      setContents(mockContents);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleViewContent = (content) => {
    setSelectedContent(content);
    setShowModal(true);
  };

  const handleDeleteContent = async (id) => {
    try {
      // In a real app, this would call your backend API
      // await API.del('contentApi', `/contents/${id}`);
      
      // For demo purposes, let's just update the state
      setContents(contents.filter(content => content.id !== id));
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <p>Loading your content...</p>
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>Your Generated Content</Title>
        <CreateButton to="/generator">Create New Content</CreateButton>
      </DashboardHeader>
      
      {contents.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No Content Yet</EmptyStateTitle>
          <EmptyStateText>
            You haven't generated any content yet. Click the button below to create your first piece of content.
          </EmptyStateText>
          <CreateButton to="/generator">Generate Content</CreateButton>
        </EmptyState>
      ) : (
        <ContentGrid>
          {contents.map(content => (
            <ContentCard key={content.id}>
              <ContentTitle>{content.title}</ContentTitle>
              <ContentType>{content.contentType}</ContentType>
              <ContentDate>{new Date(content.createdAt).toLocaleDateString()}</ContentDate>
              <ContentPreview>
                {content.content.substring(0, 150)}...
              </ContentPreview>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button onClick={() => handleViewContent(content)}>View</Button>
                <Button 
                  onClick={() => handleDeleteContent(content.id)}
                  style={{ backgroundColor: '#e74c3c' }}
                >
                  Delete
                </Button>
              </div>
            </ContentCard>
          ))}
        </ContentGrid>
      )}
      
      {showModal && selectedContent && (
        <ContentModal 
          content={selectedContent} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </DashboardContainer>
  );
}

// Content Modal Component
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  &:hover {
    color: #2c3e50;
  }
`;

const ModalTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const ModalType = styled.span`
  background-color: #3498db;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  display: inline-block;
  margin-bottom: 1rem;
`;

const ModalDate = styled.p`
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
`;

const ModalContentText = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
`;

function ContentModal({ content, onClose }) {
  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <ModalTitle>{content.title}</ModalTitle>
        <ModalType>{content.contentType}</ModalType>
        <ModalDate>Created on {new Date(content.createdAt).toLocaleDateString()}</ModalDate>
        <ModalContentText>{content.content}</ModalContentText>
      </ModalContent>
    </ModalOverlay>
  );
}

export default Dashboard;