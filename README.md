# UBCO Print Farm

## About

This project aims to create a print farm for the UBCO Makerspace and document all steps so that it can be expanded and updated in the future. This repo contains all software and documentation that has been written to make this possible. This project can also be useful for any other people who need to create a print farm in a network environment that has a secured WiFi such as a university or school.

## Documentation

You can find all [documentation here](https://andrecox.github.io/ubco-print-farm)

If you are a part of the UBCO Makerspace and need to repair or upgrade, the print farm you should check the docs.

## Problems to Overcome

- 🌐 Devices on Wifi can't communicate with each other.
- 🖥️ Can't port forward to the internet.
- 🧑‍💻 Need user friendly way for people to request prints.
- 💪 Flexible and powerful for integration into other applications.

## Development Practices

I recommend using Yarn as your package manager for this project all examples will use yarn.

You should use functional React components as often as possible as they are easier to debug and require less code. State should be handled through React Hooks or MobX State Management.

When adding code to this project you should follow the style guidelines. To make this easier I have included 2 tools, The first is a `.prettierrc` file if you install the prettier extension in your code editor it and set it as your default code formatter it will automatically format your code to follow the style guidelines.

The next tool is a `.eslintrc.js` file when you run `yarn lint` it will scan all code to make sure that it complies with the style guidelines.

## Running the Program

### Preview Documentation

`yarn docs` Opens documentation in new browser window
Live preview of changes made in the `\apps\docs` Folder

### Start all applications

`yarn dev` Runs all programs in parallel in dev mode

### Lint all code

`yarn lint` Runs linting to check for syntactical consistency

## Understanding the Repository Structure

This project uses a Monorepo, This is done as it makes this project very scalable and we can also share modules, and files across multiple projects resulting in minimal code reuse. The software I'm using is called [TurboRepo](https://turbo.build/repo)

#### Notable Directories and files

Look here if there are any files you are not familiar with.

```
.
├── .github/
│   └── workflows/             # This folder contains github action files that automate the repository.
├── apps/                      # Contains the different projects, new projects need a new folder in here.
│   └── docs/                  # Contains the code that generates our documentation website.
├── packages                   # Any dependencies for the apps are stored in here, they are shared between apps.
│   ├── eslint-config-custom   # Folder contains formatting information to make sure code is consistent.
│   └── tsconfig               # Typescript config, for type checking is in this folder.
├── turbo.json                 # Configuration for turborepo which is used for the monorepo.
└── package.json               # Contains information about version, and scripts that can be run.

```

# Architecture Overview

![A diagram of the infrastructure](./architecture.svg)
