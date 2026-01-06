# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.23](http://gitea:3000/notNilton/almeida/compare/v0.0.22...v0.0.23) (2026-01-06)

### [0.0.22](http://gitea:3000/notNilton/almeida/compare/v0.0.21...v0.0.22) (2026-01-06)

### [0.0.21](http://gitea:3000/notNilton/almeida/compare/v0.0.20...v0.0.21) (2026-01-06)


### Features

* Add PORT environment variable to API service configuration ([8961031](http://gitea:3000/notNilton/almeida/commit/89610319606a7233fc2a228651056dedda270d7a))

### [0.0.20](http://gitea:3000/notNilton/almeida/compare/v0.0.19...v0.0.20) (2026-01-06)


### Features

* Refactor Gitea deploy workflow into separate jobs and reorder node-prune in the backend Dockerfile. ([0f0dc7a](http://gitea:3000/notNilton/almeida/commit/0f0dc7a6584ffca69101f31f00ae5221e2e201c4))

### [0.0.19](http://gitea:3000/notNilton/almeida/compare/v0.0.18...v0.0.19) (2026-01-06)

### [0.0.18](http://gitea:3000/notNilton/almeida/compare/v0.0.17...v0.0.18) (2026-01-06)

### [0.0.17](http://gitea:3000/notNilton/almeida/compare/v0.0.16...v0.0.17) (2026-01-06)

### [0.0.16](http://gitea:3000/notNilton/almeida/compare/v0.0.15...v0.0.16) (2026-01-06)


### Bug Fixes

* adjust Prisma client output paths in Dockerfile and schema.prisma ([1b5ef9f](http://gitea:3000/notNilton/almeida/commit/1b5ef9f282536c8bf2ac93a9af620d3d6687a3d4))

### [0.0.15](http://gitea:3000/notNilton/almeida/compare/v0.0.14...v0.0.15) (2026-01-06)

### [0.0.14](http://gitea:3000/notNilton/almeida/compare/v0.0.13...v0.0.14) (2026-01-06)


### Bug Fixes

* preserve generated Prisma client during production dependency installation ([908eeae](http://gitea:3000/notNilton/almeida/commit/908eeaec38e0f1eae99f44dcaefaa171a8d64926))

### [0.0.13](http://gitea:3000/notNilton/almeida/compare/v0.0.12...v0.0.13) (2026-01-06)


### Bug Fixes

* Replace `pnpm prune` with `rm -rf` and `pnpm install --prod` for correct production dependency management in Dockerfile. ([4b52a1f](http://gitea:3000/notNilton/almeida/commit/4b52a1fce299f108f7ebd312ca444674fec1963e))

### [0.0.12](http://gitea:3000/notNilton/almeida/compare/v0.0.11...v0.0.12) (2026-01-06)

### [0.0.11](http://gitea:3000/notNilton/almeida/compare/v0.0.10...v0.0.11) (2026-01-06)

### [0.0.10](http://gitea:3000/notNilton/almeida/compare/v0.0.9...v0.0.10) (2026-01-06)


### Bug Fixes

* Correct Dockerfile artifact copying and command for monorepo structure. ([6618d0b](http://gitea:3000/notNilton/almeida/commit/6618d0b77649ef7ea75c73b8b93a9336abd3eafb))

### [0.0.9](http://gitea:3000/notNilton/almeida/compare/v0.0.8...v0.0.9) (2026-01-06)

### [0.0.8](http://gitea:3000/notNilton/almeida/compare/v0.0.7...v0.0.8) (2026-01-06)

### [0.0.7](http://gitea:3000/notNilton/almeida/compare/v0.0.6...v0.0.7) (2026-01-06)


### Bug Fixes

* Correct Docker entrypoint path and remove debug command. ([feb6c16](http://gitea:3000/notNilton/almeida/commit/feb6c162780ae73db64a6792054b828f9d5499dc))

### [0.0.6](http://gitea:3000/notNilton/almeida/compare/v0.0.5...v0.0.6) (2026-01-06)


### Bug Fixes

* Correct Dockerfile copy source path for NestJS build output from `dist/apps/back-end` to `apps/back-end/dist`. ([a54d082](http://gitea:3000/notNilton/almeida/commit/a54d0822f248f2b04455773c461cd48470d647de))

### [0.0.5](http://gitea:3000/notNilton/almeida/compare/v0.0.4...v0.0.5) (2026-01-06)


### Features

* Dynamically determine Linux distribution for Docker installation in deploy workflow. ([a7d26ff](http://gitea:3000/notNilton/almeida/commit/a7d26ff733aa8cff8ade10962b1e7f336974c864))


### Bug Fixes

* correct backend build output copy path in Dockerfile and add debug `ls` command for dist folder. ([68b2d98](http://gitea:3000/notNilton/almeida/commit/68b2d98dc1f2aa2aee12997e09cadfb2cbc0e796))

### [0.0.4](http://gitea:3000/notNilton/almeida/compare/v0.0.3...v0.0.4) (2026-01-06)

### [0.0.3](http://gitea:3000/notNilton/almeida/compare/v0.0.2...v0.0.3) (2026-01-06)

### [0.0.2](http://gitea:3000/notNilton/almeida/compare/v0.0.1...v0.0.2) (2026-01-06)


### Features

* Add CI workflow for build and lint checks and install Docker in deploy workflow. ([fb0c53f](http://gitea:3000/notNilton/almeida/commit/fb0c53f506f9b7c8bdc87500fb6cc88dd155ac7c))
* add react-hooks/set-state-in-effect ESLint rule ([2cfdbeb](http://gitea:3000/notNilton/almeida/commit/2cfdbebd6e854f7f17d1670a2b1a20b1cfc3e131))


### Bug Fixes

* **back-end:** resolve major typescript checking errors and ignore generated files ([8d84453](http://gitea:3000/notNilton/almeida/commit/8d84453c55073879104e5a50085ac6c4dcaff620))
* fix linting errors ([3fc09e0](http://gitea:3000/notNilton/almeida/commit/3fc09e04dd4b20f9eeb312c663f41fcb54932170))
* Update Docker repository from Debian to Ubuntu in Gitea workflow. ([2e483d9](http://gitea:3000/notNilton/almeida/commit/2e483d9a3f41618a624888899862448bb3e39f0d))

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
