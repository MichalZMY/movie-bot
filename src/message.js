const moment = require('moment');

const recastBot = require('./bot');
const movieApi = require('./movieApi.js');
const constants = require('./constants');

function onNewMessage(message) {
  const text = message.content;
  const senderId = message.senderId;

  console.log('The bot received: ', text);

  return recastBot.request
    .converseText(text, { conversationToken: senderId })
    .then(function(conversation) {
      if (!conversation.action) {
        return message.reply({
          type: 'text',
          content: "I don't have an action for this sentence yet :(",
        });
      }

      console.log('The conversation action is: ', conversation.action.slug);

      conversation.replies.forEach(function(replyContent) {
        message.addReply({ type: 'text', content: replyContent });
      });

      return message.reply();
    })
    .catch(function(err) {
      console.error('Recast::request::converseText error: ', err);
    });
}

module.exports = onNewMessage;
