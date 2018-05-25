class PagesController < ApplicationController

  before_action :check_if_logged_in, only: [:characters, :game]
  before_action :check_if_character_logged_in, only: [:game]

  def character_new
    @character = Character.new
  end

  def character_create
    character = Character.new character_params
    character.user = @current_user
    character.gold = 0
    character.save
    if character.persisted?
      session[:character_id] = character.id
      redirect_to characters_path
    else
      flash[:errors] = character.errors.full_messages
      redirect_to character_new_path
    end
  end

  def characters
  end

  def character_login
    $current_character = Character.find_by id: params[:id]
    session[:character_id] = params[:id]
    redirect_to game_path
  end

  def game
    @gold = @current_character.gold
  end

  def test
    @items = Item.all
  end

  private

  def character_params
    params.require(:character).permit(:name)
  end
end
