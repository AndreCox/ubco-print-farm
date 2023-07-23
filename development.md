# Development

## Running the Program

### Preview Documentation

`yarn docs` Opens documentation in new browser window
Live preview of changes made in the `\apps\docs` Folder

### Start all applications

`yarn dev` Runs all programs in parallel in dev mode

### Lint all code

`yarn lint` Runs linting to check for syntactical consistency

## Development Practices

I recommend using Yarn as your package manager for this project all examples will use yarn.

You should use functional React components as often as possible as they are easier to debug and require less code. State should be handled through React Hooks or MobX State Management.

When adding code to this project you should follow the style guidelines. To make this easier I have included 2 tools, The first is a `.prettierrc` file if you install the prettier extension in your code editor it and set it as your default code formatter it will automatically format your code to follow the style guidelines.

The next tool is a `.eslintrc.js` file when you run `yarn lint` it will scan all code to make sure that it complies with the style guidelines.

## Understanding the Repository Structure

This project uses a Monorepo, This is done as it makes this project very scalable and we can also share modules, and files across multiple projects resulting in minimal code reuse. The software I'm using is called [TurboRepo](https://turbo.build/repo)

### Notable Directories and files

Look here if there are any files you are not familiar with.
This is not a complete list of all files and directories, just the ones that I feel are most important.

```
.
├── .github/
│   └── workflows/             # This folder contains github action files that automate the repository.
├── apps/                      # Contains the different projects, new projects need a new folder in here.
│   └── docs/                  # Contains the code that generates our documentation website.
|   └── frontend/              # Contains the code for the frontend of the application.
|   |   └── pages/             # This folder contains the pages that are rendered by nextjs.
|   |       └── api/           # This folder contains the api endpoints that are used by the frontend.
|   └── backend/               # Contains the code for the backend of the application.
|   └── database/              # Contains the docker-compose file for the database.
|   └── storage/               # Contains the docker-compose file for the minio object storage.
├── packages                   # Any dependencies for the apps are stored in here, they are shared between apps.
│   ├── eslint-config-custom   # Folder contains formatting information to make sure code is consistent.
│   └── tsconfig               # Typescript config, for type checking is in this folder.
├── turbo.json                 # Configuration for turborepo which is used for the monorepo.
└── package.json               # Contains information about version, and scripts that can be run.

```

## Architecture Overview

![A diagram of the infrastructure](./architecture.svg)


# Overview of the different components
To understand the repository fully I have documented the different apps that make up the project.
This repository is a monorepo, this means that all the different apps are stored in the same repository.
This is done as it makes this project very scalable and we can also share modules, and files across multiple projects resulting in minimal code reuse. The software I'm using is called [TurboRepo](https://turbo.build/repo)

The 5 main apps are the frontend, backend, database, storage, and docs. The frontend is the website that the user interacts with, the backend is the server that handles the logic, the database is where all the persistent data is kept, and the storage is where all the uploaded files are stored.
The docs app is a special app that is used to generate the documentation website.

## Frontend
The frontend is a [NextJS](https://nextjs.org/) application, it is a React framework that allows us to easily create a server-rendered React application. It also allows us to easily create API endpoints that can be used by the frontend. This somewhat complicates the project as we have API endpoints in 2 different places, the backend, and the frontend. I tend to find that the frontend API endpoints are simpler and are used for things like authentication, and the backend API endpoints are used for more complex things like file uploads and obtaining video streams. However, this is not a hard rule and you should use your best judgment when deciding where to put an API endpoint. 

### UI Library's

I use [TailwindCSS](https://tailwindcss.com/) for styling the frontend. It is a utility-first CSS framework that allows us to easily create a responsive website. It is very easy to use and I recommend reading the documentation to get a better understanding of how it works.

While TailwindCSS provides great fine grained control of styling the website It can take some time to create a component from scratch. To speed up development I use [Material Tailwind](https://material-tailwind.com/) which is a UI library that is built on top of TailwindCSS. It provides a lot of prebuilt components that can be used to quickly create a website. This has the added benefit of making the website look more consistent as all the components are built using the same design language.

### Code Styling Rules
The frontend uses [Typescript](https://www.typescriptlang.org/) and [React](https://reactjs.org/). The code styling rules are enforced by [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). The rules are defined in the `.eslintrc.js` and `.prettierrc` files. The rules are enforced by the `yarn lint` command. You can also install the ESLint and Prettier extensions in your code editor to get real-time feedback on your code.

I do not like the use of class components as they are harder to debug and require more code. I recommend using functional components as often as possible. I also recommend using React Hooks for state management as they are easier to use and require less code. If possible use constants instead of functions as it is slightly more concise.

An example of code that follows the style guidelines is shown below.

```tsx
// Write nice concise code like this
import { useState } from "react";

const MyComponent = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={increment}>Click me</button>
    </div>
  );
};
```

An example of code that does not follow the style guidelines is shown below.

```tsx
// Don't do this
import React from "react";

function MyComponent() {
  const [count, setCount] = React.useState(0);

  function increment() {
    setCount(count + 1);
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={increment}>Click me</button>
    </div>
  );
}
```

Another example of code that does not follow the style guidelines is shown below.

```tsx
// Don't do this
import React from "react";

// This is a class component
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={this.increment}>Click me</button>
      </div>
    );
  }
}
```




### Pages
The pages folder contains all the pages that are rendered by NextJS. The pages are sorted into subfolder's depending on their function for example all the pages that are used for authentication are in the authentication folder. This means that if a user goes to the login page the path would be ```authentication/login```. Another example is any admin pages are stored in the ```printfarm/admin``` folder. This means that if a user goes to the admin page the path would be ```printfarm/admin```. This makes it easier to find pages as they are sorted into folders based on their function. 

#### Protecting Pages

Some pages are protected and can only be accessed by authenticated users. To protect a page we use RouteGuards. A RouteGuard is a function that is run before the page is rendered. If the RouteGuard returns true the page is rendered, if the RouteGuard returns false the user is redirected to the login page. We have 2 kinds of RouteGuards the first is for general users and the second is for admin users.

The routeguards are stored in the ```components/guards``` directory.

An example of the two different RouteGuards is shown below.

```tsx
// This is a RouteGuard for general users
import RouteGuard from "./components/guards/RouteGuard";

const GuardedPage = () => {
  return (
    <RouteGuard loadingMessage={"This is a loading message"}>
      <div>This page is protected only authenticated users can view</div>
    </RouteGuard>
  );
};

export default GuardedPage;
```

```tsx
// This is a RouteGuard for admin users
import AdminGuard from "./components/guards/AdminGuard";

const GuardedPage = () => {
  return (
    <AdminGuard loadingMessage={"This is a loading message"}>
      <div>This page is protected only admins can view</div>
    </AdminGuard>
  );
};

export default GuardedPage;
```

### Components

The components folder contains components that are used by pages. It is a good way of decluttering pages and making them easier to read. This is good for reducing code duplication as you can reuse components across multiple pages.

<b>
Note: I always use functional components as they are easier to debug and require less code.
</b>

#### Performance Implications

When you add state to a component and then use that component in a page only that component will be rerendered when the state changes instead of the whole page. Therefore it is a good idea to use components to reduce the amount of code in a page and to make it easier to read.

I like to write the code for a page first then break it up into components. This makes it easier to see what components are needed and how they should be structured. 



