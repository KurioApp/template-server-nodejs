# Node.js Server
Node.js server is a web server written in Node.js

## NPM Scripts
### `npm run dev`
Runs the server in development mode using [Nodemon](https://nodemon.io/) for auto-restart upon change

### `npm build`
Transpiles the JS files to compatible version in `dist` directory with [Babel](https://babeljs.io/)

### `npm start`
Run the server from the transpiled files inside `dist` directory

### `npm test`
Runs the tests inside `__tests__` directory using [Jest](https://jestjs.io/)

### `npm run lint`
Runs lint checking using [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/)

### `npm run lint -- --fix`
Auto-fix lint errors

