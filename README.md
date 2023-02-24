# Greddit

## How to run

To run the dockerized app, run the command `DOCKER_BUILDKIT=0 docker-compose up --build`, and then got to localhost:8080 in chrome. If you want to run the app without the dockerization, set up two terminals, at the frontend and backend directory respectively and run the `npm i` command followed by the `npm start` command in both.

## Design Choices Made

1. Whenever something needs to be created, either the page already contains a creation area, or a new page is opened.

2. Reports without concern text are allowed

3. When searching for subgreddits through tags, in order for a a subgreddit to show up all the specified tags must be a part of the tags of the subgreddit.
   
4. When a report is taken action against with the blocked action, the report is removed.

## Bonuses Done

1. Google Oauth
2. Implemented Fuzzy Search for SubGreddits
3. Used charts for the Stats page

