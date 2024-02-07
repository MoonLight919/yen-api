# Setup

- [Initial setup](#initial-setup)
- [Database](#database)
- [Start application](#start-application)
- [Testing](#testing)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

### <a name="initial-setup"></a> Initial setup

For deploy project locally, please follow the next guide:

1. **Clone project**

   ```shell
   $ git clone git@github.com:MoonLight919/yen-api.git
   ```

### <a name="database"></a> Database

Since we are using SQL database here, schema changes are required to properly handle new features.
To support a comfortable schema changes we are utilizing the [Atlas](https://atlasgo.io) tool to handle schema changes and provision changes on the database.
First of all, you need to install Atlas CLI https://atlasgo.io/getting-started#installation
If you are not a database maintainer, the only command that you need to use is following:

```shell
$ atlas migrate apply --env yen
```

This command will run required migrations and apply them to your database.
This command by default applies changes to database on localhost, but you are be able to override certain values.
Here is an example how to apply migrations for the `test_integration` database:

```shell
$ atlas migrate apply --env yen --var database=test_integration
```

It's recommended to run `atlas migrate apply` every time when you make `git pull`. This will make sure that you are using the latest database schema and prevents backend feature incompatibility

### <a name="start-application"></a> Start application

To run the application use command below in the container shell (after `devspace dev`):

```shell
$ yarn start
```

> Basically, if you are just a consumer of backend application, common development scenario wil be following:
>
> 1. If you in the container shell, type `exit` to leave the container
> 1. `git pull` - To pull new changes developed by backend team
> 1. `atlas migrate apply --env yen` - Updates a database schema
> 1. `yarn start` - To start an application again
>
> But sometimes extra steps could be taken due to changes in the devspace or other internal configuration.
> Follow backend team recommendations

That's all, if you made everything right, you should see logs about successfully started an application, and your application will be available on port 3000

Try to access it by following command:

```shell
$ curl -i http://localhost:3000
```

You should get `404 Not Found` response. That means a backend is started and is capable to process requests

### <a name="testing"></a> Testing

```shell
$ yarn test
```

### <a name="scripts"></a> Scripts

Make production build and save output to `dist` folder

```bash
$ yarn build
```

Start project in development mode

```bash
$ yarn start
```

Remove folder `dist`

```bash
$ yarn clean
```

Lint project files with Eslint

```bash
$ yarn lint
```

Lint all tests files in the project with Eslint

```bash
$ yarn lint:test
```

Format all project files with Prettier

```bash
$ yarn format
```

Run integration tests

```bash
$ yarn test:integration
```
