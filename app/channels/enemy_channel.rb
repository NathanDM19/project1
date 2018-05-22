class EnemyChannel < ApplicationCable::Channel
  def subscribed
    ActionCable.server.config.logger = Logger.new(nil)
    stream_from "enemy_channel"
  end

  def unsubscribed

  end

  def create(data)
    if data['enemyDamage'] == -100
      Enemy.create id:data['enemyId'], x:data['x'], y:data['y'], health:100, total:1
      # a = Enemy.new
      # a.x = data['x']
      # a.y = data['y']
      # a.health = 100
      # a.total = 1
      # a.save

    elsif data['enemyDamage'] == 9000
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: data['x'], y: data['y']
    elsif data['enemyId'].to_i > 1 && data['enemyDamage'] > 0
      a = Enemy.find data['enemyId']
      a.health = a.health.to_i - data['enemyDamage'].to_i
      # puts a.health
      if a.health.to_i <= 0
        a.total = 0
      end
      # puts a.health
      a.save
      x = rand(200)+100
      y = rand(200)+500
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: x, y: y
    else
      x = rand(200)+100
      y = rand(200)+500
      ActionCable.server.broadcast 'enemy_channel', enemyId: data['enemyId'], enemyDamage: data['enemyDamage'], x: x, y: y
    end
  end

  # Don't need 2?

  # def perform_action(data)
  #   Rails.logger.silence do
  #     super(data)
  #   end
  # end
end
