var AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
});

var tableName = 'NodeJsBaseballStats';

var dynamodb = new AWS.DynamoDB();

// Load the data
var teams = require('./teams.json');
var players = require('./players.json');
var games = require('./games.json');

putItems(teams)
    .then(() => {
        return putItems(players);
    })
    .then(() => {
        return putItems(games);
    })
    .catch((err) => {
        console.error('Insert failed', err);
    });

function putItems(items)
{
    var insertedCount = 0;
    return new Promise((resolve, reject) => {

        items.forEach(item => {

            var params = {
                TableName: tableName,
                Item: item
            };

            dynamodb.putItem(params, (err, data) => {
                if(err) {
                    reject(err);
                }
                else {
                    if(++insertedCount == items.length) {
                        console.log('Successfully inserted ' + items.length + ' items.');
                        resolve();
                    }
                }
            });
        });

    });
}