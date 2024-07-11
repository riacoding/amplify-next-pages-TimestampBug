const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb')
const fs = require('fs')
const csv = require('csv-parser')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

const REGION = 'us-west-2' // e.g., 'us-east-1'
const amplifyOutputsPath = path.join(__dirname, 'amplify_outputs.json')
const amplifyOutputs = JSON.parse(fs.readFileSync(amplifyOutputsPath, 'utf8'))
const TABLE_NAME = amplifyOutputs.custom.PostTable

const dynamoDbClient = new DynamoDBClient({ region: REGION })
const ddbDocClient = DynamoDBDocumentClient.from(dynamoDbClient)

const uploadCsvToDynamoDB = async (csvFilePath) => {
  try {
    const results = []
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          const params = {
            TableName: TABLE_NAME,
            Item: {
              id: uuidv4(), // Generate a UUID for the id
              content: row.content,
              __typename: 'Post',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }
          try {
            await ddbDocClient.send(new PutCommand(params))
            console.log(`Successfully uploaded: ${row.content}`)
          } catch (err) {
            console.error(`Error uploading: ${row.content}`, err)
          }
        }
      })
  } catch (err) {
    console.error('Error reading CSV file', err)
  }
}

const csvFilePath = './data.csv' // Replace with the path to your CSV file
uploadCsvToDynamoDB(csvFilePath)
