// Import the API methods from aws-amplify/api
import { get, post, put, del } from 'aws-amplify/api';

// Function to fetch all content
export const getAllContent = async () => {
  try {
    const response = await get({
      apiName: 'api925f3beb',
      path: '/contents'
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
};

// Function to fetch content by ID
export const getContentById = async (id) => {
  try {
    const response = await get({
      apiName: 'api925f3beb',
      path: `/contents/${id}`
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    throw error;
  }
};

// Function to fetch content by user ID
export const getContentByUserId = async (userId) => {
  try {
    const response = await get({
      apiName: 'api925f3beb',
      path: `/contents/user/${userId}`
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching content by user ID:', error);
    throw error;
  }
};

// Function to create new content
export const createContent = async (contentData) => {
  try {
    const response = await post({
      apiName: 'api925f3beb',
      path: '/contents',
      options: {
        body: contentData
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
};

// Function to generate content with AI
export const generateContent = async (contentData) => {
  try {
    const response = await post({
      apiName: 'api925f3beb',
      path: '/contents/generate',
      options: {
        body: contentData
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

// Function to update content
export const updateContent = async (id, contentData) => {
  try {
    const response = await put({
      apiName: 'api925f3beb',
      path: `/contents/${id}`,
      options: {
        body: contentData
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
};

// Function to delete content
export const deleteContent = async (id) => {
  try {
    const response = await del({
      apiName: 'api925f3beb',
      path: `/contents/${id}`
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
};