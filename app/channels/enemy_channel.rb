class EnemyChannel < ApplicationCable::Channel
  def subscribed
    ActionCable.server.config.logger = Logger.new(nil)
    stream_from "enemy_channel"
  end

  def unsubscribed

  end

  def create(data)
    if data['actionName'] == 'database' #database
      Enemy.create id:data['enemyId'], x:data['x'], y:data['y'], health:100, total:data['enemyDamage']
      # a = Enemy.new
      # a.x = data['x']
      # a.y = data['y']
      # a.health = 100
      # a.total = 1
      # a.save
    elsif data['actionName'] == 'gold'
      a = Character.find data['currentCharacter']
      a.gold = data['enemyId']
      a.save
    elsif data['actionName'] == 'move'
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: data['x'], y: data['y'], actionName: 'move', char:data['currentCharacter']
    elsif data['actionName'] == 'login' # login?
      a = Enemy.find data['enemyId']
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: data['x'], y: data['y'], actionName: 'login', char:data['currentCharacter'], health: a.health
    elsif data['actionName'] == 'damage' #damage
      a = Enemy.find data['enemyId']
      a.health = a.health.to_i - data['enemyDamage'].to_i
      # puts a.health
      if a.health.to_i <= 0
        y = a.total
        a.destroy
        x = 1
      else
        y = 0
        x = 0
      end
      # puts a.health
      a.save
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: x, y: y, actionName: 'damage', char:data['currentCharacter']

    elsif data['actionName'] == 'create'# create
      if data['enemyDamage'] == 1
        x = rand(95)+50
        y = rand(100)+600
      elsif data['enemyDamage'] == 2
        x = rand(95)+50
        y = rand(100)+900
      elsif data['enemyDamage'] == 3
        x = rand(95)+675
        y = rand(100)+600
      elsif data['enemyDamage'] == 4
        x = rand(95)+675
        y = rand(100)+900
      end
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: x, y: y, actionName: 'create', char:data['currentCharacter']
    end
  end

  # Don't need 2?

  # def perform_action(data)
  #   Rails.logger.silence do
  #     super(data)
  #   end
  # end
end
