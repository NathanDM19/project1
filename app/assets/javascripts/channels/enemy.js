this.App = {};

App.cable = ActionCable.createConsumer();
App.enemy = App.cable.subscriptions.create('EnemyChannel', {
  received: function(data) {
    if (data['actionName'] === 'damage') { // damage
      enemy[data['enemyId']]['health'] -= data['enemyDamage']
      enemy[data['enemyId']]['healthBar'].setScale(enemy[data['enemyId']]['health']/100, 1)
      if (enemy[data['enemyId']]['health'] <= 0) {
        aliveEnemy[`undead${enemy[data['enemyId']]['type']}`] -= 1
        if (aliveEnemy['undead1'] === 0 && data['char'] === currentCharacter) {
          aliveEnemy['undead1'] += 1
          App.enemy.create(enemyId, 1, 0, 0, 'create', data['char'])
        }
        if (aliveEnemy['undead2'] === 0 && data['char'] === currentCharacter) {
          aliveEnemy['undead2'] += 1
          App.enemy.create(enemyId, 2, 0, 0, 'create', data['char'])
        }
      }
    }
    if (data['actionName'] === 'move') {
      if (data['enemyDamage'] !== currentCharacter) {
        enemy[data['enemyId']]['position']['x'] = data['x']
        enemy[data['enemyId']]['position']['y'] = data['y']
        enemy[data['enemyId']]['enemy'].x = data['x']
        enemy[data['enemyId']]['enemy'].y = data['y']
        enemy[data['enemyId']]['following'] = data['enemyDamage']
      }
      enemy[data['enemyId']]['enemy'].anims.play('undeadWalk', true)
      if (data['enemyDamage'] === -1) {
        enemy[data['enemyId']]['enemy'].anims.play('undeadStand')
        enemy[data['enemyId']]['following'] = 0
      }
    }
    if (data['actionName'] === 'create' && data['char'] === currentCharacter) { // NO ENEMIES
      databaseEnemy(data['x'], data['y'], data['enemyDamage'])
    }
    if (data['actionName'] === 'create') {
      createEnemy(data['x'], data['y'], data['enemyDamage'])
    }
    if (data['actionName'] === 'login' && data['char'] === currentCharacter) { // LOGIN
      createEnemy(data['x'], data['y'], data['enemyDamage'], data['enemyId']) // x y enemyId, enemyType
    }
    function createEnemy(x, y, enemyType, localEnemyId) {
      if (localEnemyId) {
        id = localEnemyId
      } else {

        id = enemyId.toString()
      }
      if (!enemy[id]) {
      // console.log(gameEdit)
        console.log("Created enemy "+enemyType+" at "+x+" "+y+" with id "+id)
        enemy[id] = {}
        enemy[id]['enemy'] = gameEdit.physics.add.sprite(x, y, 'undead')
        enemy[id]['enemy'].body.setSize(32, 48)
        enemy[id]['type'] = enemyType
        enemy[id]['position'] = {}
        enemy[id]['position']['x'] = x
        enemy[id]['position']['y'] = y
        // enemy[id]['name'] = gameEdit.add.text(x, y+30, id) // ADD ID ABOVE ENEMY
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
            console.log("attacked "+this.id)
            damage(this.id, enemyDamage)
          }
        }
        enemy[id]['attack']['id'] = id
        gameEdit.physics.add.collider(player, enemy[id]['enemy'], enemy[id]['attack'])
        gameEdit.physics.add.collider(enemy[id]['enemy'], platforms)
        enemyId += 1
      }
      // else {
      //   enemyId += 1
      // }
    }
  },
  create: function(enemyId, enemyDamage, x, y, actionName, currentCharacter){
    // console.log(enemyId, enemyDamage, x, y)
    this.perform('create', {enemyId, enemyDamage, x, y, actionName, currentCharacter});
  }
})
