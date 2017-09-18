const moment = require('moment');

const recastBot = require('./bot');
const movieApi = require('./movieApi.js');
const constants = require('./constants');

function onNewMessage(message) {
  const text = message.content;

  console.log('The bot received: ', text);
  return message.reply([{ type: 'text', content: 'Hello world!' }])
    .catch(function(err) {
      console.error('message::reply error: ', err);
    });
}

module.exports = onNewMessage;
