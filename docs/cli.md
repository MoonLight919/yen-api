# YEN CLI

## Introduction

We are using custom CLI tool to accomplish general things in the project. To check all available commands, please use

```shell
$ yarn yen --help
```

Each command can have subcommands. To check subcommands please use option `--help` with command before

```shell
$ yarn yen create --help
```

## Basic commands

### Create user in Auth0 and save into the database

For instance, you have started working on the project, and you need to create test user for calling backend API.
Thus, full Auth0 flow requires to be enabled hooks and bootstrapped ngrok, this way a bit harder than just use.
Instead, you can use `create auth0-user` command

```shell
$ yarn yen create auth0-user
```

This command will generate random user, create in Auth0 and save into the database with connected auth0 user id.
Created user will be outputted to terminal, there you will find `email` and `password` to log in.

If you would like to specify custom data, you can use available command options.
For instance, reuse existing Auth0 user and create only database user

```shell
$ yarn yen auth0 create-user --sub 'auth0|6227a87bb7b953006866ee9c'
```

Or, specify own email

```shell
$ yarn yen auth0 create-user --email 'my@email.com'
```

To check other available options, please refer help of command

```shell
$ yarn yen auth0 create-user --help
```

### Create user in database

The difference with command above is you don't need to configure Auth0 credentials to make access to Auth0.
It's greatly fits cases when you are utilizing disabled authentication and don't use Auth0 at all.

To create a new user run command:

```shell
$ yarn yen create user
```

This command will leverage faker.js lib to generate a fully random user.
If you want to override certain parameters you can pass additional flags.

For instance, to specify particular email, you can run command in following way:

```shell
$ yarn yen user create --email developer@gmail.com
```

To get a full list of available parameters, run help command

```shell
$ yarn yen user create --help
```
