class UsersController < ApplicationController

    before_action :check_if_logged_in, only: [:profile]
    before_action :get_user, only: [:show, :edit, :update]

    def new
      @user = User.new
    end

    def create
      user = User.create user_params
      if user.persisted?
        session[:user_id] = user.id
        redirect_to profile_path
      else
        flash[:errors] = user.errors.full_messages
        redirect_to new_user_path
      end
    end

    def index
    end

    def show
    end

    def edit
    end

    def update
      @user.update user_params
      redirect_to profile_path  # go to show page
    end

    def destroy
    end

    def profile
    end

    private
      # strong params, doorman
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation, :name, :username, :age)
    end

    def get_user
        @user = User.find params[:id]
    end
end
