class ApplicationController < ActionController::Base

  before_action :fetch_user

  def check_if_logged_in
    unless @current_user.present?
      flash[:error] = "You must be logged in to view that page."
      redirect_to login_path
    end
  end

  def check_if_character_logged_in
    unless @current_character.present?
      flash[:error] = "You must have chosen a character to view that page."
      redirect_to characters_path
    end
  end

  private

  def fetch_user
    # Retrieve the currently logged in user's row from the database
    # (if they *are* actually logged in)
    if session[:user_id].present?
      @current_user = User.find_by id: session[:user_id] #dont use User.find, bad error when not found
    end
    if session[:character_id].present?
      @current_character = Character.find_by id: session[:character_id]
    end


    # Just in case we're dealing with a stale user ID
    # (i.e. an ID which no longer exists in the database)
    # we shoud delete the bad session
    session[:user_id] = nil unless @current_user.present?
    session[:character_id] = nil unless @current_character.present?
  end

end
