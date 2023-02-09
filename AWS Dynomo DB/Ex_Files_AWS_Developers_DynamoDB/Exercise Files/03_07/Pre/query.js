var AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
});

var tableName = 'NodeJsBaseballStats';

var dynamodb = new AWS.DynamoDB();

getGames('LAA', '20190401', '20190501', 'SEA')
    .then(games => {
        console.log(JSON.stringify(games));
    })
    .catch(ex => {
        console.error('An error occurred', ex);
    });

function getGames(teamId, startDate, endDate, opposingTeamId) {
    return new Promise((resolve, reject) => {
        var params = {
            KeyConditionExpression: 'TeamID = :t AND SK BETWEEN :startDate AND :endDate',
            ExpressionAttributeValues: {
                ':t': { S: 'GAMES_' + teamId },
                ':startDate': { S: startDate },
                ':endDate': { S: endDate },
                ':opp':{S:opposingTeamId}
            },
            FilterExpression: 'OpposingTeamID = :opp',
            TableName: tableName
        };

        dynamodb.query(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}

function getGame(teamId, dateStr) {
    return new Promise((resolve, reject) => {
        var params = {
            KeyConditionExpression: 'TeamID = :t AND SK = :sk',
            ExpressionAttributeValues: {
                ':t': { S: 'GAMES_' + teamId },
                ':sk': { S: dateStr }
            },
            TableName: tableName
        };

        dynamodb.query(params, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}