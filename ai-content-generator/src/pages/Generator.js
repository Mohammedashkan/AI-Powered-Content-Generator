import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockGenerateContent } from '../services/openai';
import styled from 'styled-components';
import { get, post } from 'aws-amplify/api';

const GeneratorContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #2c3e50;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 150px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #2980b9;
  }
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

const ResultContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ResultTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1rem;
`;

const ResultContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #fadbd8;
  border-radius: 4px;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #d5f5e3;
  border-radius: 4px;
`;

function Generator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'blog',
    prompt: '',
  });
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // In a real app, this would call your backend API
      // const response = await generateContent({
      //   ...formData,
      //   userId: user.username
      // });
      
      // For demo purposes, we'll use the mock service
      const response = await mockGenerateContent({
        ...formData,
        userId: user.username
      });
      
      setGeneratedContent(response);
    } catch (error) {
      console.error('Error generating content:', error);
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // In a real app, this would save to your backend
      // Update the commented code to use the new API pattern
      // await post({
      //   apiName: 'api925f3beb',
      //   path: '/contents',
      //   options: {
      //     body: generatedContent
      //   }
      // });
      
      // For demo purposes, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Content saved successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Failed to save content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GeneratorContainer>
      <Title>Generate New Content</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter a title for your content"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="contentType">Content Type</Label>
          <Select
            id="contentType"
            name="contentType"
            value={formData.contentType}
            onChange={handleChange}
            required
          >
            <option value="blog">Blog Post</option>
            <option value="marketing">Marketing Copy</option>
            <option value="story">Creative Story</option>
            <option value="social">Social Media Post</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            name="prompt"
            value={formData.prompt}
            onChange={handleChange}
            required
            placeholder="Describe what you want the AI to generate..."
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Content'}
        </Button>
      </Form>
      
      {generatedContent && (
        <ResultContainer>
          <ResultTitle>{generatedContent.title}</ResultTitle>
          <ResultContent>
            {generatedContent.content}
          </ResultContent>
          <Button
            onClick={handleSave}
            style={{ marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Content'}
          </Button>
        </ResultContainer>
      )}
    </GeneratorContainer>
  );
}

export default Generator;