this.App = {};

App.cable = ActionCable.createConsumer();
App.enemy = App.cable.subscriptions.create('EnemyChannel', {
  received: function(data) {
    if (data['actionName'] === 'damage') { // damage
      enemy[data['enemyId']]['health'] -= data['enemyDamage']
      enemy[data['enemyId']]['healthBar'].setScale(enemy[data['enemyId']]['health']/100, 1)
      if (enemy[data['enemyId']]['health'] <= 0 && data['x'] === 1) {
        for (let i = 1; i <= enemies; i++) {
          if (data['y'] === i && data['char'] === currentCharacter) {
            window.setTimeout(function() {
              App.enemy.create(enemyId, i, 0, 0, 'create', data['char'])
            }, 20000)
            if (quests[1]['active'] && quests[1]['total'] < 10) {
              quests[1]['total'] += 1;
              quests[1]['activeText'].setText(`Kill 10 undead enemies: ${quests[1]['total']}/10`)
              if (quests[1]['total'] === 10) {
                quests[1]['activeText'].setText(`Complete! Kill 10 undead enemies: ${quests[1]['total']}/10`)
              }
            }
          }
        }
      }
    }
    if (data['actionName'] === 'enemyReset') {
      enemy[data['enemyId']]['health'] = 100
      enemy[data['enemyId']]['healthBar'].setScale(enemy[data['enemyId']]['health']/100, 1)
    }
    if (data['actionName'] === 'move') {
      if (data['enemyDamage'] !== currentCharacter) {
        enemy[data['enemyId']]['position']['x'] = data['x']
        enemy[data['enemyId']]['position']['y'] = data['y']
        enemy[data['enemyId']]['enemy'].x = data['x']
        enemy[data['enemyId']]['enemy'].y = data['y']
        enemy[data['enemyId']]['following'] = data['enemyDamage']
      }
      if (enemy[data['enemyId']]['health'] > 0) {
        // enemy[data['enemyId']]['enemy'].anims.play('undeadWalk', true)
      }
      if (data['enemyDamage'] === -1) {
        // enemy[data['enemyId']]['enemy'].anims.play('undeadIdle', true)
        enemy[data['enemyId']]['following'] = 0
      }
      if (enemy[data['enemyId']]['heath'] <= 0) {
        // enemy[data['enemyId']]['enemy'].anims.play('undeadDeath', true);
      }
    }
    if (data['actionName'] === 'create' && data['char'] === currentCharacter) { // NO ENEMIES
      databaseEnemy(data['x'], data['y'], data['enemyDamage'])
    }
    if (data['actionName'] === 'create') {
      createEnemy(data['x'], data['y'], data['enemyDamage'])
    }
    if (data['actionName'] === 'login' && data['char'] === currentCharacter) { // LOGIN
      createEnemy(data['x'], data['y'], data['enemyDamage'], data['enemyId'], data['health']) // x y enemyId, enemyType
    }
    function createEnemy(x, y, enemyType, localEnemyId, health) {
      if (localEnemyId) {
        id = localEnemyId
      } else {

        id = enemyId.toString()
      }
      if (!enemy[id]) {
        console.log("Created enemy "+enemyType+" at "+x+" "+y+" with id "+id)
        enemy[id] = {
          enemy: gameEdit.physics.add.sprite(x, y, 'undead'),
          type: enemyType,
          position: {
            x: x,
            y: y,
            startX: x,
            startY: y,
          },
          following: 0,
          healthBarBack: gameEdit.add.image(200, 200, 'healthBarBack'),
          healthBar: gameEdit.add.image(200, 200, 'healthBar')
        }
        if (data['health']) {
          enemy[id]['health'] = data['health']
        } else {
          enemy[id]['health'] = 100
        }
        enemy[data['enemyId']]['healthBar'].setScale(enemy[data['enemyId']]['health']/100, 1)
        enemy[id]['enemy'].body.setSize(32, 48)
        enemy[id]['healthBarBack'].x = enemy[id]['enemy'].x
        enemy[id]['healthBarBack'].y = enemy[id]['enemy'].y - 36
        enemy[id]['healthBar'].x = enemy[id]['enemy'].x
        enemy[id]['healthBar'].y = enemy[id]['enemy'].y - 36
        enemy[id]['pause'] = false
        enemyCollide[id] = {}
        enemyCollide[id][2] = 0
        enemy[id]['attack'] = function() {
          enemyCollide[this.id]['collide'] = true
          enemyCollide[this.id][1] += 1
          if (cursors.space.isDown) {
            if (!spacePressed) {
              console.log("RUN")
              enemyDamage = 10
              damage(this.id, enemyDamage)
              spacePressed = true
              enemy[this.id]['pause'] = true;
              test = this.id
              window.setTimeout(function() {
                enemy[test]['pause'] = false
              }, 1000)
            }
          } else if(cursors.space.isUp) {
            spacePressed = false;
          }
        }
        enemy[id]['attack']['id'] = id
        gameEdit.physics.add.collider(player, enemy[id]['enemy'], enemy[id]['attack'])
        gameEdit.physics.add.collider(enemy[id]['enemy'], platforms)
        enemyId += 1
      }
    }
  },
  create: function(enemyId, enemyDamage, x, y, actionName, currentCharacter){
    // console.log(enemyId, enemyDamage, x, y)
    this.perform('create', {enemyId, enemyDamage, x, y, actionName, currentCharacter});
  }
})
