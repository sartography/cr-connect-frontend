# sartography/cr-connect-frontend
[![Build Status](https://travis-ci.com/sartography/cr-connect-frontend.svg?branch=master)](https://travis-ci.com/sartography/cr-connect-frontend)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=sartography_cr-connect-frontend&metric=coverage)](https://sonarcloud.io/dashboard?id=sartography_cr-connect-frontend)

# CR Connect Frontend
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.15.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Local Development with Sartogprahy Libraries
If you are making changes to the Sartography Libraries dependency, you
can use npm link to connect the two systems.
On the library side, run
```bash
ng build --watch
```
Then create a link to the built values by cd'ing into the dist directory (in a new terminal, leave the build above running)
```bash
cd sartography-libraries/dist/sartography-workflow-lib
npm link
```

On the frontend code, link to the sartgraph-workflow-lib:
```bash
npm link sartography-workflow-lib
ng serve
```

 Also note that you may need to add
 ```json
             "preserveSymlinks": true
```
to your angular.json file in build/options.

At this point any changes you make to the shared libraries should be immediately reflected in your locally running front end.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
