## YEN

- [General](#general)
- [Development Setup](#development-setup)
- [Test setup](#test-setup)
- [Scripts](#scripts)
- [Submitting a Pull Request (PR)](#submit-pr)
- [Commit Message Guidelines](#commit)

### <a name="general"></a> General

This project developed by the [Ihor Andriienko](https://www.linkedin.com/in/moonlight919/).

### <a name="development-setup"></a> Development setup

You will need Node.js version 18.17.1+

The project is using various technology and adhere the approach as simple as possible.
For deploy project locally, please follow the next guide:

1. Clone this project

   ```shell
   $ git clone git@github.com:MoonLight919/yen-api.git
   ```

2. Install dependencies

   ```shell
   $ yarn install
   ```

3. Run database and other external dependencies required for application working

   ```shell
   $ docker-compose up -d
   ```

4. Create a database with name `main` for running application locally and
   `test_integration` for running integration tests (You can use tools such as https://dbeaver.io/ or `psql`)

5Now you can run the project with command

```shell
$ yarn start
```

### <a name="test-setup"></a> Test setup

The unit tests you can run without any requirements, just run

```shell
$ yarn test:unit
```

Before running integration tests you will need to create `test_integration` database before run

```shell
$ yarn test:integration
```

To run all unit and integration tests together and build coverage report by the 2 types of tests run:

```shell
$ yarn test
```

### Scripts

```bash
# Make production build and save output to `dist` folder
$ yarn build

# Start project in development mode
$ yarn start

# Start project in development with after reloading (Requires node.js => 14)
$ yarn start:dev

# Start project in development with after reloading and debugger attached
$ yarn start:debug

# Start project in production mode
$ yarn start:prod

# Remove folder `dist`
$ yarn clean

# Lint project files with Eslint
$ yarn lint

# Lint all tests files in the project with Eslint
$ yarn lint:test

# Format all project files with Prettier
$ yarn format

# Run unit tests
$ yarn test

# Run integration tests (Requires docker-compose up -d before)
$ yarn test:integration

# Proxy for knex bin with attached typescript compiler and default configuration for database
$ yarn knex
```

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

To the first point

1. Make your changes in a new git branch:

   ```shell
   git checkout -b my-fix-branch master
   ```

   Be aware! All new branches should be created from main branch, currently is `master`

1. Create your patch or feature, **including appropriate test cases**.
1. Follow our Coding Rules.
1. Commit your changes using a descriptive commit message that follows our
   [commit message conventions](#commit).

   ```shell
   git commit -a
   ```

   Note: the optional commit `-a` command line option will automatically "add" and "rm" edited files.

1. Push your branch to GitHub:

   ```shell
   git push origin my-fix-branch
   ```

1. In GitHub, create a pull request to `master`.

- If we suggest changes then:

  - Make the required updates.
  - Re-run the tests.
  - Rebase your branch and force push to your GitHbu repository (this will update your Pull Request):

    ```shell
    git rebase master -i
    git push -f
    ```

That's it! Thank you for your contribution!

## <a name="commit"></a> Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

Footer should contain a [closing reference to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword) if any.

Samples: (even more [samples](https://github.com/MoonLight919/yen-api/commits/main))

```
docs(): update change log to beta.5
fix(auth): fix token verification
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- **chore**: Updating tasks etc; no production code change or changes do not respective business requirements of the client
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests
- **deps**: Upgrading direct or dev dependencies

### Scope

The scope should be the name of the domain entity.

The following is the list of supported scopes:

- **core**

### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.
