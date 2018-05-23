class EnemyChannel < ApplicationCable::Channel
  def subscribed
    ActionCable.server.config.logger = Logger.new(nil)
    stream_from "enemy_channel"
  end

  def unsubscribed

  end

  def create(data)
    if data['actionName'] == 'database' #database
      Enemy.create id:data['enemyId'], x:data['x'], y:data['y'], health:100, total:1
      # a = Enemy.new
      # a.x = data['x']
      # a.y = data['y']
      # a.health = 100
      # a.total = 1
      # a.save
    elsif data['actionName'] == 'login' # login?
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: data['x'], y: data['y'], actionName: 'login'
    elsif data['actionName'] == 'damage' #damage
      a = Enemy.find data['enemyId']
      a.health = a.health.to_i - data['enemyDamage'].to_i
      # puts a.health
      if a.health.to_i <= 0
        a.destroy
      end
      # puts a.health
      a.save
      x = rand(95)+50
      y = rand(100)+600
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: x, y: y, actionName: 'damage'

    elsif data['actionName'] == 'create'# create
      x = rand(95)+50
      y = rand(100)+600
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: x, y: y, actionName: 'create'
    end
  end

  # Don't need 2?

  # def perform_action(data)
  #   Rails.logger.silence do
  #     super(data)
  #   end
  # end
end
