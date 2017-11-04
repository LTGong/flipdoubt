# React Project Template

Features:

* based on <https://github.com/umn-5117-f17/express-project-template>
* based on <https://github.com/facebookincubator/create-react-app>
* includes bulma css
* includes <https://github.com/ReactTraining/react-router>

Example code:

* mongodb

## setup and run in development

* install [heroku command line app](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
* create account at [mlab](https://mlab.com/)
* create account at [auth0](https://auth0.com)
    * create a client
    * In the APIs section of the Auth0 dashboard, click Create API
      (pick any name, any identifier)
* edit file `web/.env` to configure react+auth0, and commit the changes
* create file `.env` in root of project to configure express, something like this:

```
DEBUG=app:*

PORT=3000
EXPRESS_PORT=3001

# these must match the values from web/.env
AUTH0_DOMAIN=TODO.auth0.com
AUTH0_API_ID=TODO

DB_URI=mongodb://5117:5117iscool@ec2-54-175-174-41.compute-1.amazonaws.com:80/5117-f17-individual-hw
```

* run:

```
    npm install
    npm run dev
```

## deploy to heroku

* run these commands (one-time setup, or whenever these values need to change):

```
    # add all of the config variables from .env, except DEBUG, PORT, and EXPRESS_PORT
    heroku config:set AUTH0_DOMAIN=(foo).auth0.com AUTH0_API_ID=(bar)
```

* add the callback to "allowed callback URLs" list in auth0 client settings: `https://(heroku-dns).herokuapp.com/callback`

* check the code in and `git push heroku master`
