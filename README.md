# README

* Heroku link: https://project1rpg.herokuapp.com/

* Nathan's RPG
My game is a small online RPG which allows players to do quests to earn gold for their character. The game currently only has 2 quests due to the large scale of the project.

You will need to create an account and a character to play the game.

You can use a test account to login:
Username: test@test.com
Password: chicken

* What I used to make my project
- Ruby on rails
- Phaser 3 for Javascript

* Bugs
The addition of multiplayer introduced many bugs to the game during development and made me change many of the ways to write my code that I initially thought would work. For example when damaging an enemy I originally had it so that the client would send the enemies new health to the server. This worked fine on my localhost server but once deployed to heroku the latency caused the game to get stuck in a loop of saying the initial health and the new health, and the health bar would ping back and forth between the two values. Overall these challenges made the project harder than what I originally thought.

There may be other bugs in the game that are unknown.

* Wishlist
There were many more features that I did want to add to the game, but due to time running out I just added what I thought was the main features for the game to be functional plus 2 quests for playability.
Features that I want to add in the future are:
- More quests
- More enemies
- Character level
- More Character abilities
- Item shop to spend gold
- Online marketplace between the players
- When there are more quests, know what quest the player is up to
- Larger map
- Dungeons
