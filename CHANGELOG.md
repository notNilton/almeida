# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 0.0.1 (2026-01-06)


### Features

* add .env.example and update Prisma script names in package.json ([530b168](http://gitea:3000/notNilton/almeida/commit/530b16870dc1c6f591d3e50e0a678624652a15c4))
* add employee creation page and revamp login page UI. ([d12df52](http://gitea:3000/notNilton/almeida/commit/d12df52a63962a98bc54cb761ccfdb2d129f5b7d))
* Add employee details page and contract management form. ([5ddf96e](http://gitea:3000/notNilton/almeida/commit/5ddf96e2b7731c2d1be29b9a4b05b46fc8b1af5f))
* Add employees module, remove history, projects, team, and settings modules, and update documents, users, and authentication. ([3da61c2](http://gitea:3000/notNilton/almeida/commit/3da61c2cc970c08d592791d499057208ce32b0c4))
* change Gitea Workflow ([d4736e1](http://gitea:3000/notNilton/almeida/commit/d4736e194d6651c4dac4da50c73030e6f40adf57))
* Implement automated versioning and release management with `standard-version` and package synchronization. ([1dffa1a](http://gitea:3000/notNilton/almeida/commit/1dffa1a8b5dd2419b9ee8c64aa112e7b1d201c4c))
* Implement employee editing functionality with a dedicated modal, refactor employee details page header for dynamic actions, and remove the user profile page. ([e93d89a](http://gitea:3000/notNilton/almeida/commit/e93d89ae5f814429020632a0c08136fc30603309))
* Introduce contracts and employees modules, remove history, team, and projects modules, and refactor authentication and storage providers. ([be8373d](http://gitea:3000/notNilton/almeida/commit/be8373da4d59eee307bf6ae70aed13d78ac5e072))
* Migrate all entity IDs to use nanoid and add a new settings model ([51fb3e9](http://gitea:3000/notNilton/almeida/commit/51fb3e9f594036f31a07031597c2dcdc4c08fe2e))
* remove frontend service from docker-compose.yml ([d974489](http://gitea:3000/notNilton/almeida/commit/d97448985bcd9f2ff3d889e9382a230d2dc42c9b))
* update Prisma foreign key constraints to cascade, generate Prisma client in Docker, and add new Prisma deployment scripts. ([dc96601](http://gitea:3000/notNilton/almeida/commit/dc96601bad8e42e33710a44b9e81585e93dd4336))
* Use lowercase repository name for Docker image tags and deployment variables in the Gitea workflow. ([8a90b3d](http://gitea:3000/notNilton/almeida/commit/8a90b3da98935771110793a8a350337699e6f36f))


### Bug Fixes

* add `DATABASE_URL` to `prisma:generate` command and copy `node_modules` and `package.json` to final stage. ([e590e66](http://gitea:3000/notNilton/almeida/commit/e590e66f45b54d6dbf06f76c7d4bf66a370b4515))
* Correct Dockerfiles for monorepo builds by copying full project context before installation and adjusting build artifact paths. ([ecab2dc](http://gitea:3000/notNilton/almeida/commit/ecab2dca70da06845c938f363b785e58f8d2da53))
* Correct Nginx configuration file path in Dockerfile. ([564ba65](http://gitea:3000/notNilton/almeida/commit/564ba659a9d75a026c9690bb839e9334df230ddd))
* Improve deploy CI/CD ([c70c873](http://gitea:3000/notNilton/almeida/commit/c70c8738e2f7b33838b44f76d76c309da0a81319))
* minor changes ([a654ddf](http://gitea:3000/notNilton/almeida/commit/a654ddf9338ffab139384fdbb2d3e27153c4c9f3))
* more minor changes ([d89a35a](http://gitea:3000/notNilton/almeida/commit/d89a35ad90bd0fac5606ae5e956dcbdfbad3e49c))
