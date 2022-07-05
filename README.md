# React Calendar

<img src="src/client/assets/calendar.png" width="500"  />

## Description

**React Calendar** is an easy-to-use online calendar build with [React Big Calendar](https://jquense.github.io/react-big-calendar/examples/index.html?path=/story/about-big-calendar--page). I built this demo as an proof-of-concept to show how to integrate a third party UI library in React. It also utilizes data available at the [Calendarific Holidays API](https://calendarific.com/api-documentation). The app has some architectural elements in place (e.g. JSON Web Token, Mongoose) to help developers scale it up easily. Feel free to fork or extend the codebase for your own project!

React Calendar is an example of a "MERN stack" application which consists of the following technologies:

- **MongoDB**: A document-based open source database.
- **Express**: A web application framework for Node.js.
- **React**: A JavaScript front-end library for building user interfaces.
- **Node.js**: JavaScript run-time environment that executes JavaScript code outside of a browser (such as a server).

The MERN stack makes it possible to quickly build and easily maintain a full-stack web app. While MERN is a solid foundation for building a web app, extending the app's functionality can sometimes present challenges. For example, while attempting to build an authentication layer using JSON Web Token (JWT), it took me a bit of trial and error to figure out the logic behind the network calls used to create tokens and refresh tokens. Although it wasn't totally clear at first, going through the process step by step helped me better understand not only how to work with JWT, but how the authentication layer impacts the developer and user experience.

## File structure

- `src`
  - `config` - This folder holds app configuration files
  - `client` - This folder holds frontend files
    - `assets` - This folder holds assets such as images
    - `components` - This folder holds different components that will make up our views
    - `pages` - This folder holds components organized by page level view
    - `store` - This folder holds files used to connect to the Redux store and call actions
    - `styles` - This folder holds stylesheets used by the frontend
    - `utils` - This folder holds utility functions
    - `App.js` - Renders all of our browser routes and different views
    - `index.html` - Our index.html file
    - `index.css` - Stylesheet for app-wide styles
    - `index.js` - Entrypoint for React app
    - `validation.ts` - Used for form validation
  - `server` - This folder holds backend files
    - `controllers` - This folder holds controller functions used by Express.js
    - `db` - This folder holds database connection files
    - `middleware` - This folder holds middleware used by Express.js
    - `models` - This folder holds database models
    - `routers` - This folder holds routers used by Express.js
    - `utils` - This folder holds utility functions
    - `server-dev.js` - Entrypoint for Node.js app in development mode
    - `server-prod.js` - Entrypoint for Node.js app in production mode
- `package.json` - Defines npm behaviors and packages
- `package-lock.json` - Tracks dependency tree
- `.babelrc` - Configuration file for Babel.js
- `.env.example` - Sample file containing environment variables used by dotenv.js
- `.gitignore` - Directories to exclude from git tracking
- `.prettierrc` - Configuration file for Prettier.js
- `.jest.config.js` - Configuration file for Jest.js
- `.seedHolidayEvents.js` - Script for seeding holiday event documents in MongoDB
- `.webpack.common.js` - Webpack configuration file for common settings
- `.webpack.development.js` - Webpack configuration file for development mode settings
- `.webpack.production.js` - Webpack configuration file for production mode settings
- `README.md` - This file!

## Initial Setup

React Calendar was built using Node version 16. Please install a long-term support (LTS) version for best compatibility with other libraries.

- Node.js <https://nodejs.org/en/download/>

To verify that you have Node.js installed on your system, type the following command in your command line terminal (Terminal for Mac/Linux, CMD for Windows).

```console
node -v
```

### Environment Variables

Before you build or run the app, create two new files called `.env.development` and `.env.production` at the project root. These are configuration files that will be used by dotenv.js to expose environment variables to your app at runtime.

In each file, you need to enter values for the following environment variables (refer to `.env.example` for examples):

`PORT`: Port where the app will run

`MONGO_HOSTNAME`: Name of the Mongo host (e.g. `localhost` in development mode)

`MONGO_PORT`: Mongo port (e.g. `27017`)

`MONGO_DB`: Name of the Mongo database used

`API_URL`: Base URL for API calls to the Node app (e.g. `http://localhost:3001/api` in development mode)

`THECOCKTAILDB_API_URL`: Base URL for The CocktailDB API

`YOUTUBE_API_URL`: Base URL for Youtube Data API

`YOUTUBE_API_KEY`: Key used for Youtube Data API calls. You need to create a free Google Developers account in order to generate this key.

`JWT_SECRET_KEY`: Private key used by JSON Web Token (JWT)

`JWT_EXPIRATION`: JWT token expiration (in seconds)

`JWT_REFRESH_EXPIRATION`: JWT refresh token expiration (in seconds)
