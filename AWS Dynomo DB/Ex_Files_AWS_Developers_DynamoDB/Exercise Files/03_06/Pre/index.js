// Create table
var AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
});

var dynamodb = new AWS.DynamoDB();
var params =
{
    TableName: 'NodeJsBaseballStats',
    KeySchema: [
        { AttributeName: 'TeamID', KeyType: 'HASH' },    // Partitionkey
        { AttributeName: 'SK', KeyType: 'RANGE' }        // SortKey
    ],
    AttributeDefinitions: [
        { AttributeName: 'TeamID', AttributeType: 'S'},
        { AttributeName: 'SK', AttributeType: 'S'}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if(err) {
        console.error('Unable to create table!', JSON.stringify(err));
    }else {
        console.log('Table created!');
    }
});