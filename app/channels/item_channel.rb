class ItemChannel < ApplicationCable::Channel
  def subscribed
    ActionCable.server.config.logger = Logger.new(nil)
    stream_from "item_channel"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def create(data)
    # a = Character.find data['currentCharacter']
    # a.gold = data['gold'].to_i
    # a.save
    name = Character.find data['currentCharacter']
    ActionCable.server.broadcast 'item_channel', gold: data['gold'], currentCharacter: data['currentCharacter'], xPos: data['xPos'], yPos: data['yPos'], direction: data['direction'], name: name.name, health: data['health'], enemyHealth: data['enemyHealth']
  end

  def perform_action(data)
    Rails.logger.silence do
      super(data)
    end
  end

end
