##Skill Sharing: An Eloquent JS Mini Project

This is my completion of the mini-project in chapter 21 of [Marijn Haverbeke's Eloquent JavaScript](http://eloquentjavascript.net/21_skillsharing.html). It consists of a server and client program that allow the user to interact with hypothetical talks for a skill sharing group. The server contains and serves the data on the talks, such as their title, speaker, abstract, and comments. The user can enter in new talks, enter in comments, and delete talks. This isn't meant to be a real application, as there are no safeguards against anyone deleting a talk or leaving any kind of comments or adding a bogus talk. Rather, this is meant to be an exercise in building a server and a client-side application to interact with it.

*Note: the following assumes you have [Node.js](https://nodejs.org/en/) installed.*

To run the application:

* Clone down this repo.
* Run `npm install`.
* Run `node server.js` to start up the back-end server.
* Visit `localhost:8000` in your favorite browser to access the front-end interface.

This repo was built using my [Bash Scripts for Webpack](https://github.com/gness1804/bash-scripts-for-webpack) starter kit.
