this.App = {};

App.cable = ActionCable.createConsumer();
App.item = App.cable.subscriptions.create('ItemChannel', {
  received: function(data) {
    playerDetails[ data['currentCharacter'] ] = {'xPos': data['xPos'], 'yPos': data['yPos'], 'direction': data['direction'], name: data['name'], health: data['health']}
    if (data['enemyDamage'] !== 0) {
      enemy[data['tempEnemyId']]['health'] -= data['enemyDamage']
      enemy[data['tempEnemyId']]['healthBar'].setScale(enemy[data['tempEnemyId']]['health']/100, 1)
    }
    if (enemyCounter === 0) {
      enemyCounter += 1
    // console.log("ola")
      createEnemy()
    }
    function createEnemy(x, y) {
      tempEnemyId = enemyId.toString()
      if (singleEnemy) {
        enemy[tempEnemyId] = {}
        enemy[tempEnemyId]['enemy'] = gameEdit.physics.add.sprite(100, 700, 'undead')
        enemy[tempEnemyId]['position'] = {}
        enemy[tempEnemyId]['position']['x'] = 100
        enemy[tempEnemyId]['position']['y'] = 700
        enemy[tempEnemyId]['healthBarBack'] = gameEdit.add.image(200, 200, 'healthBarBack')
        enemy[tempEnemyId]['healthBar'] = gameEdit.add.image(200, 200, 'healthBar')
        enemy[tempEnemyId]['healthBarBack'].x = enemy[tempEnemyId]['enemy'].x
        enemy[tempEnemyId]['healthBarBack'].y = enemy[tempEnemyId]['enemy'].y - 36
        enemy[tempEnemyId]['healthBar'].x = enemy[tempEnemyId]['enemy'].x
        enemy[tempEnemyId]['healthBar'].y = enemy[tempEnemyId]['enemy'].y - 36
        enemy[tempEnemyId]['health'] = 100
        enemy[tempEnemyId]['attack'] = function() {
              if (cursors.space.isDown) {
                spacePressed = true
              }
              if (cursors.space.isUp && spacePressed) {
                spacePressed = false;
                enemyDamage = 10
                runCreate(tempEnemyId, enemyDamage)
              }
            }
        gameEdit.physics.add.collider(player, enemy[tempEnemyId]['enemy'], enemy[tempEnemyId]['attack'])
        enemyId += 1
      }
    }

    // if (enemyHealth <= 0) {
    //   // enemyHealth = 100;
    //   singleEnemy = true;
    //   // enemy.disableBody(true, true)
    //   enemyHealthBarBack.setScale(0)
    //   window.setTimeout(createEnemy, 1000)
    // }
  },
  create: function(gold, currentChar, xPos, yPos, direction, health, tempEnemyId, enemyDamage){
    this.perform('create', {gold, currentCharacter, xPos, yPos, direction, health, tempEnemyId, enemyDamage});
  }
});
