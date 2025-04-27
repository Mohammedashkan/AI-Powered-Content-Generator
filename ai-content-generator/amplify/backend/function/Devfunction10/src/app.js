/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

const ddbClient = new DynamoDBClient({ region: process.env.TABLE_REGION });
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// Update these variables to match your DynamoDB table configuration
let tableName = "dynamobdev10";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = true; // Set to true since we're using userId
const partitionKeyName = "id";
const partitionKeyType = "S";
const sortKeyName = "createdAt";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/contents";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/************************************
* HTTP Get method to list all contents *
************************************/

app.get(path, async function(req, res) {
  var params = {
    TableName: tableName,
    Select: 'ALL_ATTRIBUTES',
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});

/************************************
 * HTTP Get method to get content by userId using GSI *
 ************************************/

app.get(path + '/user/:userId', async function(req, res) {
  const userId = req.params.userId;
  
  const params = {
    TableName: tableName,
    IndexName: "userIndex",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId
    }
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    res.json(data.Items);
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load items: ' + err.message});
  }
});

/************************************
 * HTTP Get method to get content by id *
 ************************************/

app.get(path + '/:id', async function(req, res) {
  const params = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: req.params.id
    }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));
    if (data.Item) {
      res.json(data.Item);
    } else {
      res.status(404).json({ error: "Content not found" });
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({error: 'Could not load item: ' + err.message});
  }
});

/************************************
* HTTP post method to create content *
*************************************/

app.post(path, async function(req, res) {
  if (userIdPresent && req.apiGateway) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  // Ensure id and createdAt are set
  if (!req.body.id) {
    req.body.id = Date.now().toString();
  }
  
  if (!req.body.createdAt) {
    req.body.createdAt = new Date().toISOString();
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  
  try {
    let data = await ddbDocClient.send(new PutCommand(putItemParams));
    res.json({ 
      success: 'Content created successfully!', 
      id: req.body.id,
      content: req.body 
    });
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err.message, url: req.url, body: req.body });
  }
});

/************************************
* HTTP post method to generate content *
*************************************/

app.post(path + '/generate', async function(req, res) {
  // This would be where you'd call OpenAI API in a real implementation
  // For now, we'll just mock the response
  
  const { title, contentType, prompt, userId } = req.body;
  
  let content = '';
  
  switch (contentType) {
    case 'blog':
      content = `# ${title}\n\n## Introduction\n\nIn today's fast-paced digital world, ${prompt} has become increasingly important. This blog post explores the key aspects and provides valuable insights.\n\n## Main Points\n\n1. Understanding the basics of ${prompt}\n2. How ${prompt} impacts modern businesses\n3. Best practices for implementing ${prompt} strategies\n\n## Conclusion\n\nAs we've seen, ${prompt} plays a crucial role in today's landscape. By following the guidelines outlined in this post, you'll be well-equipped to leverage its potential for your success.`;
      break;
    case 'marketing':
      content = `# ${title}\n\n**Are you ready to transform your business with ${prompt}?**\n\nIntroducing our revolutionary approach to ${prompt} that will skyrocket your results!\n\n## Why Choose Our Solution?\n\n✅ Instant results\n✅ Cost-effective implementation\n✅ Expert support\n\nDon't miss this opportunity to stay ahead of your competition. Contact us today to learn more about how ${prompt} can benefit your business.`;
      break;
    case 'story':
      content = `# ${title}\n\nOnce upon a time in a world where ${prompt} was the most precious resource, there lived a young adventurer named Alex.\n\nAlex had always been fascinated by the mysteries of ${prompt}, spending countless hours studying ancient texts that described its magical properties.\n\nOne stormy night, a mysterious stranger arrived at Alex's door with a map that supposedly led to the greatest source of ${prompt} ever discovered.\n\nThus began an epic journey across treacherous mountains, through enchanted forests, and into the depths of forgotten caves.\n\nAfter many trials and tribulations, Alex finally discovered the source, but learned that the true value of ${prompt} wasn't in possessing it, but in sharing its benefits with the world.`;
      break;
    case 'social':
      content = `# ${title}\n\n📣 Game-changing insights about ${prompt} you can't afford to miss! 🚀\n\nWe've just published our latest research on how ${prompt} is transforming the industry. Key takeaways:\n\n• Innovation is happening faster than ever\n• Early adopters are seeing 3x better results\n• The future is here, and it's all about ${prompt}\n\nDouble tap if you're as excited about ${prompt} as we are! 👇\n\n#${prompt.replace(/\s+/g, '')} #Innovation #FutureIsBright`;
      break;
    default:
      content = `# ${title}\n\nThis is generated content about ${prompt}. The possibilities are endless when it comes to AI-generated content!`;
  }
  
  const generatedContent = {
    id: Date.now().toString(),
    title,
    contentType,
    content,
    createdAt: new Date().toISOString(),
    userId: userId || (userIdPresent && req.apiGateway ? req.apiGateway.event.requestContext.identity.cognitoIdentityId : UNAUTH)
  };
  
  res.json(generatedContent);
});

/************************************
* HTTP put method to update content *
*************************************/

app.put(path + '/:id', async function(req, res) {
  if (userIdPresent && req.apiGateway) {
    req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH;
  }

  // Ensure id matches the path parameter
  req.body.id = req.params.id;
  
  // Don't allow changing the createdAt timestamp
  if (req.body.createdAt) {
    delete req.body.createdAt;
  }
  
  // Get the existing item first
  const getParams = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: req.params.id
    }
  };
  
  try {
    const existingData = await ddbDocClient.send(new GetCommand(getParams));
    
    if (!existingData.Item) {
      return res.status(404).json({ error: "Content not found" });
    }
    
    // Merge the existing item with the updates
    const updatedItem = {
      ...existingData.Item,
      ...req.body,
      // Preserve the original createdAt
      createdAt: existingData.Item.createdAt,
      // Add updatedAt timestamp
      updatedAt: new Date().toISOString()
    };
    
    const putParams = {
      TableName: tableName,
      Item: updatedItem
    };
    
    await ddbDocClient.send(new PutCommand(putParams));
    res.json({ 
      success: 'Content updated successfully!', 
      id: req.params.id,
      content: updatedItem 
    });
  } catch (err) {
    res.statusCode = 500;
    res.json({ error: err.message, url: req.url, body: req.body });
  }
});

/************************************
* HTTP delete method to remove content *
*************************************/

app.delete(path + '/:id', async function(req, res) {
  const params = {
    TableName: tableName,
    Key: {
      [partitionKeyName]: req.params.id
    }
  };

  try {
    // Check if the item exists first
    const existingData = await ddbDocClient.send(new GetCommand(params));
    
    if (!existingData.Item) {
      return res.status(404).json({ error: "Content not found" });
    }
    
    // Delete the item
    await ddbDocClient.send(new DeleteCommand(params));
    res.json({
      success: 'Content deleted successfully!',
      id: req.params.id
    });
  } catch (err) {
    res.statusCode = 500;
    res.json({error: err.message, url: req.url});
  }
});

app.listen(3000, function() {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
