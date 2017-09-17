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

      if (conversation.action.slug === 'discover') {
        return startSearchFlow(message, conversation);
      }

      if (conversation.replies.length > 0) {
        conversation.replies.forEach(replyContent =>
          message.addReply({ type: 'text', content: replyContent }),
        );
      } else {
        message.addReply({
          type: 'text',
          content: "I don't have the reply to this yet :)",
        });
      }

      return message.reply();
    })
    .catch(function(err) {
      console.error('An error occured while processing a message', err);
    });
}

function startSearchFlow(message, conversation) {
  const genre = conversation.getMemory('genre');

  if (!genre) {
    const buttons = constants.movieGenresQuick.map(function(element) {
      return {
        title: element.name,
        value: element.name,
      };
    });

    return message.reply([
      {
        type: 'quickReplies',
        content: {
          title: 'What genre of movies do you like?',
          buttons,
        },
      },
    ]);
  }

  const genreId = constants.getGenreId(genre.value);

  return movieApi
    .discoverMovie(genreId)
    .then(function(carouselle) {
      return message.reply(carouselle);
    })
    .catch(function(err) {
      console.error('An error occured while creating movie carouselle');
    });
}

module.exports = onNewMessage;
