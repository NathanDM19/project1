class GeneralChannel < ApplicationCable::Channel
  def subscribed
    ActionCable.server.config.logger = Logger.new(nil)
    stream_from "general_channel"
  end

  def unsubscribed

  end

  def create(data)
    if data['type'] == 'login'
      a = Enemy.find data['a']['enemyId']
      ActionCable.server.broadcast 'general_channel', type: 'login', enemyId: data['a']['enemyId'], x: data['a']['x'], y: data['a']['y'], char:data['a']['char'], health: a.health, enemyType: data['a']['enemyType']
    elsif data['type'] == 'create'
      id = Enemy.last.id+1
      if data['a']['enemyType'] == 1
        x = 95
        y = 660
      elsif data['a']['enemyType'] == 2
        x = 95
        y = 935
      elsif data['a']['enemyType'] == 3
        x = 720
        y = 660
      elsif data['a']['enemyType'] == 4
        x = 720
        y = 935
      end
      Enemy.create x: x, y: y, health:100, total:data['a']['enemyType']
      puts "Created enemy with ID of #{id} and type #{data['a']['enemyType']}"
      sleep(15)
      ActionCable.server.broadcast 'general_channel', type: 'create', enemyId: id, enemyType: data['a']['enemyType'], x: x, y: y, char:data['a']['char']
      puts "Placed enemy with ID of #{id} and type #{data['a']['enemyType']}"
    elsif data['type'] == 'enemyReset'
      a = Enemy.find data['a']['enemyId']
      a.health = 100
      a.save
      ActionCable.server.broadcast 'general_channel', type: 'enemyReset', enemyId: data['a']['enemyId'], char: data['a']['char']
    elsif data['type'] == 'move'
      ActionCable.server.broadcast 'general_channel', type: 'move', enemyId: data['a']['enemyId'], x: data['a']['x'], y: data['a']['y'],  char:data['a']['char']
    elsif data['type'] == 'damage' #damage
      a = Enemy.find data['a']['enemyId']
      a.health = a.health.to_i - data['a']['damage'].to_i
      if a.health.to_i <= 0
        y = a.total
        a.destroy
        killed = true
      else
        y = 0
        killed = false
      end
      a.save
      ActionCable.server.broadcast 'general_channel', type: 'damage', enemyId: data['a']['enemyId'], damage: data['a']['damage'], killed: killed, y: y, char:data['a']['char']
    elsif data['type'] == 'gold'
      a = Character.find data['a']['char']
      a.gold = data['a']['gold']
      a.save
    elsif data['type'] == 'character'
      name = Character.find data['a']['char']
      ActionCable.server.broadcast 'general_channel', type: 'character', gold: data['a']['gold'], char: data['a']['char'], x: data['a']['x'], y: data['a']['y'], direction: data['a']['direction'], name: name.name, health: data['a']['health']
    end
  end

  def perform_action(data)
    Rails.logger.silence do
      super(data)
    end
  end
end
