import { post } from 'aws-amplify/api';

// Update any API calls in this file
export const generateContent = async (data) => {
  try {
    const response = await post({
      apiName: 'api925f3beb',
      path: '/generate',
      options: { 
        body: data 
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

// If you have a mock function, keep it as is
export const mockGenerateContent = async (data) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock data
  return {
    id: 'mock-' + Date.now(),
    title: data.title,
    contentType: data.contentType,
    content: `This is a sample ${data.contentType} generated based on your prompt: "${data.prompt}"\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: data.userId
  };
};