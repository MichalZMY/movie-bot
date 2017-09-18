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
      const action = conversation.action;

      if (!action) {
        return message
          .reply([{ type: 'text', content: "I don't have an action for this sentence!" }])
          .catch(function(err) {
            console.error('message::reply error: ', err);
          });
      }

      if (conversation.action.slug === 'discover') {
        return startMovieFlow(message, conversation);
      }

      conversation.replies.forEach(function(reply) {
        message.addReply({ type: 'text', content: reply });
      });

      return message.reply().catch(function(err) {
        console.error('message::reply error: ', err);
      });
    })
    .catch(function(err) {
      console.error('Recast::request::converseText error: ', err);
    });
}

function startMovieFlow(message, conversation) {
  const genre = conversation.getMemory('genre');

  if (!genre) {
    const buttons = constants.movieGenresQuick.map(function(genre) {
      return { title: genre.name, value: genre.name };
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
      console.error('movieApi::discoverMovie error: ', err);
    });
}

module.exports = onNewMessage;
