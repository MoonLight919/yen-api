# Authentication

YEN is using Auth0 for authentication and partially for authorization.

## How to test Auth0 sign up locally

> Before start working with Auth0 locally, you need to create own Auth0 tenant for development purpose.
> How to do it, you can find here https://github.com/MoonLight919/yen-infra/blob/main/docs/auth0.md

Auth0 uses webhooks for notifying new signup.
To reaching out you locally started server by Auth0 you will need tool for tunnel proxy.
The simplest tool is [ngrok](https://ngrok.com/). You can find how to install ngrok [here](https://ngrok.com/download). Ngrok available for any platform.
After installing `ngrok` follow the next guide:

1. Run ngrok and set forwarding port on which you node.js application is started. By default it's port `3000`

   ```shell
   $ ngrok http 3000
   ```

   You will see information about your bootstrapped tunnel. You need https url, it may look in this way `https://a779b4940084.ngrok.io`

1. Using ngrok URL go to Terraform Auth0 config and apply config with your ngrok tunnel url. It will take care about all changes related to new API url.
1. Using terraform result, find generated API key and add key to your `.env`

   ```dotenv
   AUTH0_HOOKS_API_KEY=<your_api_key_from_terraform>
   ```

1. Also, to make work login functionality and let backend know against what authentication server they should verify token, you need to provide Auth0 domain in your `.env` file

   ```dotenv
   AUTH0_DOMAIN=<your_auth0_domain>
   ```

   You can find domain in your any Auth0 application

1. Now you can click sign up in front end and Auth0 will send requests with new user data to your locally started server

**NOTE**
Generally you don't need always run ngrok and change `API_URL` in actions.
It's requires only if you are testing signup or use signup flow locally.
If you want just to login and use API you need only start server and login against Auth0 without manipulations described before (you don't need start ngrok or change something in Auth0 tenant).

## Development Authentication

We are using disabled authentication mechanism for development purpose to simplify access to user profile.
We highly encourage to use this option by default due to avoiding configuring Auth0.
Basically, we recommend to use Auth0 directly only in case when you need to test some specific flow with Auth0 involved

To use it, define `FF_AUTH_ENABLED=false` in your shell. You can do it by inserting env variable before start command

```shell
$ FF_AUTH_ENABLED=false yarn start:dev
```

or, by adding this environment variable to your `.env` file

```dotenv
FF_AUTH_ENABLED=false
```

In the last option, `yarn start` command will take all environment variables automatically every time when you run start command.
After disabling authentication, backend stops to accept `Authorization` header with JWT, instead it reveals an ability to send special header `dev-user-id`.
You can insert any user id in this header, and backend will treat your request on behalf of this user.
For instance, request bellow will return user profile of user with ID `usr_1mj4ahl63m`

```shell
$ curl -i -H "user-id: usr_1mj4ahl63m" http://localhost:3000/v1/user
```

With disabled authentication, you don't need to have configured Auth0 credentials or any other parameters related to Auth0.
It will complete replace the `authorization` header and all endpoints will work as usual
