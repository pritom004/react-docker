
# React Docker CI/CD Practice Project

This repository is a small React application used to learn the path from local development to automated testing with Docker and GitHub Actions. The application itself is intentionally simple; the useful part of the project is the container and CI/CD workflow around it.

## What You Will Learn

- Run a React development server inside a Docker container.
- Use Docker Compose to manage the development and test services.
- Build a production-ready image with a multi-stage Dockerfile.
- Run the same test command locally and in GitHub Actions.
- Understand how a code push becomes a repeatable CI check.

## Prerequisites

Install the following before starting:

- [Git](https://git-scm.com/)
- [Node.js and npm](https://nodejs.org/) for running the app without Docker
- [Docker Desktop](https://www.docker.com/products/docker-desktop/), including Docker Compose

## Project Map

| File | Purpose |
| --- | --- |
| `Dockerfile.dev` | Development image. Installs dependencies and starts Create React App's development server. |
| `Dockerfile` | Production image. Builds the React bundle, then serves it with Nginx. |
| `docker-compose.yml` | Defines the development `web` service and the containerized `tests` service. |
| `.github/workflows/ci.yml` | GitHub Actions workflow that builds the development image and runs CI tests. |
| `src/App.test.js` | Example React test executed by the CI command. |
| `.dockerignore` | Keeps local dependency and environment files out of the Docker build context. |

## Run Locally Without Docker

Install dependencies and start the development server:

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000). The development server reloads when source files change.

Run the test suite in watch mode:

```bash
npm test
```

Run tests once, which is the mode needed by CI:

```bash
npm run test:ci
```

Create the optimized production bundle in `build/`:

```bash
npm run build
```

## Run the Development Environment with Docker Compose

The Compose file mounts the repository into the container, preserves the container's `node_modules`, and enables polling so file changes are detected reliably by Docker Desktop.

Start the development service:

```bash
docker compose up web
```

Open [http://localhost:3000](http://localhost:3000). Stop it with `Ctrl+C`, or run the service in the background with `docker compose up -d web`.

Run the tests in the dedicated test service in watch mode:

```bash
docker compose run --rm tests
```

For a one-time Docker test run that exits like CI, override the service command:

```bash
docker compose run --rm tests npm run test:ci
```

Remove stopped containers and the Compose network when finished:

```bash
docker compose down
```

## Build and Run the Production Image

`Dockerfile` uses two stages:

1. The `builder` stage installs npm dependencies and runs `npm run build`.
2. The final Nginx stage copies only the generated `build/` directory into the web server image.

Build the image from the project root:

```bash
docker build -t react-docker-cicd:production .
```

Run it on port 8080 of your machine. Nginx listens on port 80 inside the container:

```bash
docker run --rm -p 8080:80 react-docker-cicd:production
```

Open [http://localhost:8080](http://localhost:8080). This image does not need the source tree or the development server at runtime, which keeps the deployment image focused on serving static assets.

## Understand the CI Workflow

The workflow in `.github/workflows/ci.yml` currently runs on pushes to the `master` branch. Its job is deliberately small:

```text
push to master
	|
	v
checkout repository
	|
	v
build Dockerfile.dev image
	|
	v
run npm run test:ci in the image
	|
	v
pass or fail the GitHub Actions check
```

The equivalent local CI check is:

```bash
docker build -t react-docker-cicd:ci -f Dockerfile.dev .
docker run --rm react-docker-cicd:ci npm run test:ci
```

The important CI/CD idea is that the test environment is described as code. GitHub Actions does not need a separately configured Node.js environment for this job; it builds the same Docker development image and runs the test command inside it.

### CI vs. CD in This Repository

- **Continuous integration (CI):** implemented. A push to `master` builds a Docker image and runs the non-interactive test suite.
- **Continuous delivery/deployment (CD):** not implemented yet. The production image is available to build locally, but the workflow does not publish it to a registry or deploy it to a hosting platform.

This makes the repository a useful starting point for extending the pipeline. Possible next exercises are to run CI on pull requests, add a production image build to the workflow, tag images with the commit SHA, push them to a registry, and deploy the image after tests pass.

## Useful Commands

| Goal | Command |
| --- | --- |
| Start the app with Node.js | `npm start` |
| Run interactive tests | `npm test` |
| Run CI-style tests | `npm run test:ci` |
| Build the React bundle | `npm run build` |
| Start Docker development | `docker compose up web` |
| Run Docker tests | `docker compose run --rm tests` |
| Stop Compose services | `docker compose down` |
| Build production image | `docker build -t react-docker-cicd:production .` |

## Troubleshooting

- If port `3000` or `8080` is already in use, change the host-side port before the colon, for example `-p 8081:80`.
- If dependency changes are not reflected in a container, rebuild the development image with `docker compose build --no-cache`.
- If file changes are not detected by Docker Desktop, keep the polling environment variables defined in `docker-compose.yml`.
- If CI fails, reproduce its two Docker commands locally. This separates application test failures from GitHub Actions configuration problems.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
