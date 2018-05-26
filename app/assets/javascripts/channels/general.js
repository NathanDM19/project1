this.App = {};

App.cable = ActionCable.createConsumer();
App.general = App.cable.subscriptions.create('GeneralChannel', {
  received: function(data) {
    if (data['type'] === 'login' && data['char'] === currentCharacter) { // LOGIN
      createEnemy(data['x'], data['y'], data['enemyType'], data['enemyId'], data['health']) // x y enemyId, enemyType
    }
    else if (data['type'] === 'create') {
      createEnemy(data['x'], data['y'], data['enemyType'], data['enemyId'])
    }
    else if (data['type'] === 'enemyReset' && data['char'] !== currentCharacter) {
      enemy[data['enemyId']]['health'] = 100
      enemy[data['enemyId']]['healthBar'].setScale(enemy[data['enemyId']]['health']/100, 1)
    }
    else if (data['type'] === 'move') {
      if (data['char'] !== currentCharacter) {
        enemy[data['enemyId']]['position']['x'] = data['x']
        enemy[data['enemyId']]['position']['y'] = data['y']
        enemy[data['enemyId']]['enemy'].x = data['x']
        enemy[data['enemyId']]['enemy'].y = data['y']
        enemy[data['enemyId']]['following'] = data['char']
      }
      if (data['char'] === -1) {
        enemy[data['enemyId']]['following'] = 0
      }
    }
    else if (data['type'] === 'damage') { // damage
      enemy[data['enemyId']]['health'] -= data['damage']
      enemy[data['enemyId']]['healthBar'].setScale(enemy[data['enemyId']]['health']/100, 1)
      if (enemy[data['enemyId']]['health'] <= 0 && data['killed']) {
        for (let i = 1; i <= enemies; i++) {
          if (data['y'] === i && data['char'] === currentCharacter) {
              App.general.create('create', {'enemyType': i, 'char': data['char']})
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
    else if (data['type'] === 'character') {
      playerDetails[ data['char'] ] = {'x': data['x'], 'y': data['y'], 'direction': data['direction'], name: data['name'], health: data['health']}
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
        enemy[id]['healthBar'].setScale(enemy[data['enemyId']]['health']/100, 1)
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
              enemyDamage = 10
              damage(this.id, enemyDamage)
              spacePressed = true
            }
          } else if(cursors.space.isUp) {
            spacePressed = false;
          }
        }
        enemy[id]['attack']['id'] = id
        gameEdit.physics.add.collider(player, enemy[id]['enemy'], enemy[id]['attack'])
        gameEdit.physics.add.collider(enemy[id]['enemy'], platforms)
      }
    }
  },
  create: function(type, a){
    this.perform('create', {type, a});
  }
})
