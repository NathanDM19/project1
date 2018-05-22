this.App = {};

App.cable = ActionCable.createConsumer();
App.item = App.cable.subscriptions.create('ItemChannel', {
  received: function(data) {
    testVar = data['gold'];
    testVar2 = data['currentCharacter']
    playerDetails[ data['currentCharacter'] ] = {'xPos': data['xPos'], 'yPos': data['yPos'], 'direction': data['direction'], name: data['name'], health: data['health'], enemy: data['enemy']}
    enemyHealth = data['enemyHealth'];
    if (enemyHealth <= 0) {
      // enemyHealth = 100;
      singleEnemy = true;
      enemy.disableBody(true, true)
      enemyHealthBarBack.setScale(0)
      window.setTimeout(createEnemy, 1000)
    }

    /*
    // if (playerSprites[`player${data['currentCharacter']}`].x !== playerDetails[data['currentCharacter']]['xPos'] || playerSprites[`player${data['currentCharacter']}`].y !== playerDetails[data['currentCharacter']]['yPos']) {
    //   playerSprites[`player${data['currentCharacter']}`].x = playerDetails[data['currentCharacter']]['xPos']
    //   playerSprites[`player${data['currentCharacter']}`].y = playerDetails[data['currentCharacter']]['yPos']
    //   playerSprites[`player${data['currentCharacter']}`].anims.play(playerDetails[data['currentCharacter']]['direction'], true)
    // }
    // console.log(playerPositions)
    */
  },
  create: function(gold, currentChar, xPos, yPos, direction, health, enemy, enemyHealth){
    this.perform('create', {gold, currentCharacter, xPos, yPos, direction, health, enemy, enemyHealth});
  }
});
