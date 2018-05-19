class SessionController < ApplicationController
  def new
  end

  def create
    # raise "hell"
    user = User.find_by email: params[:email]
    if user.present? && user.authenticate(params[:password])
      # correct credentials!
      #create a cookie which stores the Rails session, including the user ID
      session[:user_id] = user.id
      redirect_to profile_path
    else
      # bad credientials, wrong email or password
      # set a flash message which will appear on the next page
      flash[:error] = "Invalid email or password"
      redirect_to login_path
    end
  end

  def destroy
    session[:user_id] = nil  #this clears the cookie
    session[:character_id] = nil
    redirect_to login_path
  end
end
