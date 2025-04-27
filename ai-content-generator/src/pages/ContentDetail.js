import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  &:hover {
    text-decoration: underline;
  }
`;

const ContentCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ContentHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
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
  margin-right: 1rem;
`;

const ContentDate = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ContentBody = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  &:hover {
    background-color: #c0392b;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContent();
  }, [id]);

  async function fetchContent() {
    try {
      // In a real app, this would call your backend API
      // const response = await API.get('contentApi', `/contents/${id}`);
      // setContent(response);
      
      // For demo purposes, let's use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock content based on ID
      const mockContent = {
        id,
        title: 'The Future of AI in Marketing',
        contentType: 'blog',
        content: `# The Future of AI in Marketing

Artificial intelligence is revolutionizing how companies approach marketing. From personalized recommendations to automated content creation, AI tools are helping marketers work more efficiently and effectively.

## How AI is Transforming Marketing

### 1. Personalized Customer Experiences
AI algorithms can analyze vast amounts of customer data to create highly personalized experiences. By understanding individual preferences and behaviors, marketers can deliver targeted content that resonates with each customer.

### 2. Predictive Analytics
AI-powered predictive analytics can forecast customer behavior, helping marketers anticipate needs and trends. This allows for more proactive marketing strategies rather than reactive ones.

### 3. Content Generation
AI tools like GPT-4 can generate high-quality marketing copy, blog posts, and social media content. While human oversight is still necessary, these tools can significantly speed up the content creation process.

### 4. Chatbots and Virtual Assistants
AI-powered chatbots provide instant customer service, answering questions and resolving issues 24/7. This improves customer satisfaction while reducing support costs.

## The Future Outlook

As AI technology continues to advance, we can expect even more sophisticated marketing applications. From hyper-personalized video content to AI-driven strategy development, the possibilities are endless.

However, it's important to remember that AI should augment human creativity, not replace it. The most successful marketing strategies will combine the efficiency and data-processing capabilities of AI with human empathy, creativity, and ethical judgment.

## Conclusion

The integration of AI in marketing is not just a trend—it's a fundamental shift in how marketing operates. Companies that embrace these technologies while maintaining a human touch will be well-positioned for success in the digital age.`,
        createdAt: new Date().toISOString()
      };
      
      setContent(mockContent);
    } catch (error) {
      console.error('Error fetching content:', error);
      setError('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        // In a real app, this would call your backend API
        // await API.del('contentApi', `/contents/${id}`);
        
        // Navigate back to dashboard
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting content:', error);
        setError('Failed to delete content. Please try again.');
      }
    }
  };

  const handleExport = () => {
    // Create a blob with the content
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <DetailContainer>
        <LoadingContainer>
          <p>Loading content...</p>
        </LoadingContainer>
      </DetailContainer>
    );
  }

  if (error) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate('/dashboard')}>
          &larr; Back to Dashboard
        </BackButton>
        <p>{error}</p>
      </DetailContainer>
    );
  }

  if (!content) {
    return (
      <DetailContainer>
        <BackButton onClick={() => navigate('/dashboard')}>
          &larr; Back to Dashboard
        </BackButton>
        <p>Content not found.</p>
      </DetailContainer>
    );
  }

  return (
    <DetailContainer>
      <BackButton onClick={() => navigate('/dashboard')}>
        &larr; Back to Dashboard
      </BackButton>
      
      <ContentCard>
        <ContentHeader>
          <Title>{content.title}</Title>
          <div>
            <ContentType>{content.contentType}</ContentType>
            <ContentDate>Created on {new Date(content.createdAt).toLocaleDateString()}</ContentDate>
          </div>
        </ContentHeader>
        
        <ContentBody>
          {content.content}
        </ContentBody>
        
        <ButtonGroup>
          <Button onClick={handleEdit}>Edit</Button>
          <Button onClick={handleExport}>Export</Button>
          <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
        </ButtonGroup>
      </ContentCard>
    </DetailContainer>
  );
}

export default ContentDetail;