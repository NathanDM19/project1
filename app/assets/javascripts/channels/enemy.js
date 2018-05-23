this.App = {};

App.cable = ActionCable.createConsumer();
App.enemy = App.cable.subscriptions.create('EnemyChannel', {
  received: function(data) {
    if (data['actionName'] === 'damage') { // damage
      console.log(data['enemyId'])
      enemy[data['enemyId']]['health'] -= data['enemyDamage']
      enemy[data['enemyId']]['healthBar'].setScale(enemy[data['enemyId']]['health']/100, 1)
      if (enemy[data['enemyId']]['health'] <= 0) {
        enemyCounter -= 1;
      }
    }
    if (data['actionName'] === 'move') {
      if (data['enemyDamage'] !== currentCharacter) {
        enemy[data['enemyId']]['position']['x'] = data['x']
        enemy[data['enemyId']]['position']['y'] = data['y']
        enemy[data['enemyId']]['enemy'].x = data['x']
        enemy[data['enemyId']]['enemy'].y = data['y']
        enemy[data['enemyId']]['following'] = data['enemyDamage']
        enemy[data['enemyId']]['enemy'].anims.play('undeadWalk', true)
      }
      if (data['enemyDamage'] === -1) {
        enemy[data['enemyId']]['enemy'].anims.play('undeadStand')
        enemy[data['enemyId']]['following'] = 0
      }
    }
    if (enemyCounter === 0 && data['actionName'] !== 'login') { // NO ENEMIES AND NOT LOGGING IN
      enemyCounter += 1
      databaseEnemy(data['x'], data['y'])
      createEnemy(data['x'], data['y'])
    } else if (data['actionName'] === 'login') { // LOGIN
      enemyCounter += 1
      createEnemy(data['x'], data['y'], data['enemyId'])
      enemyId -= 1
    }
    function createEnemy(x, y, localEnemyId) {
      if (localEnemyId) {
        id = localEnemyId
      } else {

        id = enemyId.toString()
      }
      if (!enemy[localEnemyId]) {
      // console.log(gameEdit)
        enemy[id] = {}
        enemy[id]['enemy'] = gameEdit.physics.add.sprite(x, y, 'undead')
        enemy[id]['position'] = {}
        enemy[id]['position']['x'] = x
        enemy[id]['position']['y'] = y
        enemy[id]['following'] = 0
        enemy[id]['healthBarBack'] = gameEdit.add.image(200, 200, 'healthBarBack')
        enemy[id]['healthBar'] = gameEdit.add.image(200, 200, 'healthBar')
        enemy[id]['healthBarBack'].x = enemy[id]['enemy'].x
        enemy[id]['healthBarBack'].y = enemy[id]['enemy'].y - 36
        enemy[id]['healthBar'].x = enemy[id]['enemy'].x
        enemy[id]['healthBar'].y = enemy[id]['enemy'].y - 36
        enemy[id]['health'] = 100
        enemy[id]['attack'] = function() {
          if (cursors.space.isDown) {
            spacePressed = true
          }
          if (cursors.space.isUp && spacePressed) {
            spacePressed = false;
            enemyDamage = 10
            damage(this.id, enemyDamage)
          }
        }
        enemy[id]['attack']['id'] = id
        gameEdit.physics.add.overlap(player, enemy[id]['enemy'], enemy[id]['attack'], null, this)
        gameEdit.physics.add.collider(enemy[id]['enemy'], platforms)
        enemyId += 1
      } else {
        enemyCounter -= 1
        enemyId += 1
      }
    }
  },
  create: function(enemyId, enemyDamage, x, y, actionName){
    // console.log(enemyId, enemyDamage, x, y)
    this.perform('create', {enemyId, enemyDamage, x, y, actionName});
  }
})
