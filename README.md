# @nomadic-dev/nomad-cli
Command line util that packages webpack, typescript, babel, eslint, support together for cleaner easier setups

## Usage
The development environment use @nomadic-dev/nomad-cli for development, building, and testing.   
All commands must be ran from the root folder of the project.   
@nomadic-dev/nomad-cli will pass cli arguments to the resulting commands if they are provided.

For example:   
`webpack-dev-server` supports passing the port number as follows.   
As a result `nomad server` also supports this because it passes the arguments downstream.   
Calling `nomad server --port 3500` would result in overriding the default port with localhost:3500.

### Running the Dev server
The development server with Hot Realod will run at http://localhost:3000. This command uses `webpack-dev-server`.
```
nomad serve(r)
```

### Build deployable projects
Buld the project. Outputs `./build`. This command uses `webpack-cli`
```
nomad build -e [ production | development | test | uat ]
```

### Testing
Run unit tests. This command uses `jest`
```
nomad test
```
Run unit test coverage. Outputs `./coverage`. This command uses `jest`
```
nomad test --coverage
```
Run linters. This command use `eslint`
```
nomad lint
```
Run Typescript type checks. This command uses `typescript`
```
nomad typecheck
```

## Additional Resources
[webpack-dev-server](https://webpack.js.org/configuration/dev-server/)   
[webpack-cli](https://webpack.js.org/guides/production/#npm-scripts)   
[jest](https://jestjs.io/docs/en/cli)   
[eslint](https://eslint.org/docs/user-guide/command-line-interface)   
[typescript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)   
