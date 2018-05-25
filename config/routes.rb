Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "users#profile"

  get    "/login" => "session#new"    # show the login form
  post   "/login" => "session#create" # submit the login and authenticate
  delete "/login" => "session#destroy"

  resources :users

  get "/profile"         => "users#profile"
  get "/characters"      => "pages#characters"
  get "/game"            => "pages#game"
  get "/character/login" => "pages#character_login"
  get "/character/new"   => "pages#character_new"
  post "/characters"     => "pages#character_create"
  get "/test"            => "pages#test"

  mount ActionCable.server => '/cable'
end
