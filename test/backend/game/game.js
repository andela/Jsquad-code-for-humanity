const io = require('socket.io-client');
require('should');

const socketURL = 'http://localhost:3000';

const options = {
  transports: ['websocket'],
  'force new connection': true
};

// const cfhPlayer1 = { 'name': 'Tom' };
// const cfhPlayer2 = { 'name': 'Sally' };
// const cfhPlayer3 = { 'name': 'Dana' };
describe('Game Server', function () {
  it('Should accept requests to joinGame', function (done) {
    const client1 = io.connect(socketURL, options);
    const disconnect = function () {
      client1.disconnect();
      done();
    };
    client1.on('connect', function () {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
      setTimeout(disconnect, 200);
    });
  });

  it('Should send a game update upon receiving request to joinGame', function (done) {
    const client1 = io.connect(socketURL, options);
    const disconnect = function () {
      client1.disconnect();
      done();
    };
    client1.on('connect', function () {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
      client1.on('gameUpdate', function (data) {
        data.gameID.should.match(/\d+/);
      });
      setTimeout(disconnect, 200);
    });
  });

  it('Should announce new user to all users', function (done) {
    const client1 = io.connect(socketURL, options);
    let client2;
    const disconnect = function () {
      client1.disconnect();
      client2.disconnect();
      done();
    };
    client1.on('connect', function () {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
      client2 = io.connect(socketURL, options);
      client2.on('connect', function () {
        client2.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
        client1.on('notification', function (data) {
          data.notification.should.match(/ has joined the game!/);
        });
      });
      setTimeout(disconnect, 200);
    });
  });

  it('Should start game when startGame event is sent with 3 players', function (done) {
    let client2, client3;
    const client1 = io.connect(socketURL, options);
    const disconnect = function () {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };
    const expectStartGame = function () {
      client1.emit('startGame');
      client1.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      client2.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      client3.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      setTimeout(disconnect, 200);
    };
    client1.on('connect', function () {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
      client2 = io.connect(socketURL, options);
      client2.on('connect', function () {
        client2.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
        client3 = io.connect(socketURL, options);
        client3.on('connect', function () {
          client3.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: false });
          setTimeout(expectStartGame, 100);
        });
      });
    });
  });

  it('Should automatically start game when 6 players are in a game', function (done) {
    let client2, client3, client4, client5, client6;
    const client1 = io.connect(socketURL, options);
    const disconnect = function () {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      client4.disconnect();
      client5.disconnect();
      client6.disconnect();
      done();
    };
    const expectStartGame = function () {
      client1.emit('startGame');
      client1.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      client2.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      client3.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      client4.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      client5.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      client6.on('gameUpdate', function (data) {
        data.state.should.equal('waiting for players to pick');
      });
      setTimeout(disconnect, 200);
    };
    client1.on('connect', function () {
      client1.emit('joinGame', { userID: 'unauthenticated', room: '', createPrivate: true });
      let connectOthers = true;
      client1.on('gameUpdate', function (data) {
        const gameID = data.gameID;
        if (connectOthers) {
          client2 = io.connect(socketURL, options);
          connectOthers = false;
          client2.on('connect', function () {
            client2.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
            client3 = io.connect(socketURL, options);
            client3.on('connect', function () {
              client3.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
              client4 = io.connect(socketURL, options);
              client4.on('connect', function () {
                client4.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                client5 = io.connect(socketURL, options);
                client5.on('connect', function () {
                  client5.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                  client6 = io.connect(socketURL, options);
                  client6.on('connect', function () {
                    client6.emit('joinGame', { userID: 'unauthenticated', room: gameID, createPrivate: false });
                    setTimeout(expectStartGame, 100);
                  });
                });
              });
            });
          });
        }
      });
    });
  });
});
