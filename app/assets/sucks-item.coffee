
App.item = App.cable.subscriptions.create "ItemChannel",
  connected: ->
    # Called when the subscription is ready for use on the server

  disconnected: ->
    # Called when the subscription has been terminated by the server

  received: (data) ->
    
  create: (gold) ->
    @perform 'create', gold: gold
