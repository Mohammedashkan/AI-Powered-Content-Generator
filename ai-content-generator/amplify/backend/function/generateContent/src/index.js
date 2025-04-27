const AWS = require('aws-sdk');
const { Configuration, OpenAIApi } = require('openai');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.STORAGE_CONTENTTABLE_NAME;

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    };

    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'CORS preflight response' }),
      };
    }

    // Parse request body
    const requestBody = JSON.parse(event.body);
    const { title, contentType, prompt, userId } = requestBody;

    if (!title || !contentType || !prompt || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate content using OpenAI
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Create a ${contentType} with the title "${title}" about "${prompt}".`,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const generatedContent = completion.data.choices[0].text.trim();

    // Save to DynamoDB
    const contentItem = {
      id: Date.now().toString(),
      userId,
      title,
      contentType,
      content: generatedContent,
      createdAt: new Date().toISOString(),
    };

    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: contentItem,
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(contentItem),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to generate content' }),
    };
  }
};