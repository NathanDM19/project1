this.App = {};

App.cable = ActionCable.createConsumer();
App.item = App.cable.subscriptions.create('ItemChannel', {
  received: function(data) {
    testVar = data['gold'];
    testVar2 = data['currentCharacter']
    playerDetails[ data['currentCharacter'] ] = {'xPos': data['xPos'], 'yPos': data['yPos'], 'direction': data['direction'], name: data['name'], health: data['health']}
    /*
    // if (playerSprites[`player${data['currentCharacter']}`].x !== playerDetails[data['currentCharacter']]['xPos'] || playerSprites[`player${data['currentCharacter']}`].y !== playerDetails[data['currentCharacter']]['yPos']) {
    //   playerSprites[`player${data['currentCharacter']}`].x = playerDetails[data['currentCharacter']]['xPos']
    //   playerSprites[`player${data['currentCharacter']}`].y = playerDetails[data['currentCharacter']]['yPos']
    //   playerSprites[`player${data['currentCharacter']}`].anims.play(playerDetails[data['currentCharacter']]['direction'], true)
    // }
    // console.log(playerPositions)
    */
  },
  create: function(gold, currentChar, xPos, yPos, direction, health){
    this.perform('create', {gold, currentCharacter, xPos, yPos, direction, health});
  }
});
