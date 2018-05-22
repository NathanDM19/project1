
App.cable = ActionCable.createConsumer();
App.item = App.cable.subscriptions.create('ItemChannel', {
  received: function(data) {
    playerDetails[ data['currentCharacter'] ] = {'xPos': data['xPos'], 'yPos': data['yPos'], 'direction': data['direction'], name: data['name'], health: data['health']}
  },
  create: function(gold, currentChar, xPos, yPos, direction, health){
    this.perform('create', {gold, currentCharacter, xPos, yPos, direction, health});
  }
});
