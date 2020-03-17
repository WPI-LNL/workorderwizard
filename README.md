# WorkorderWizard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Deploying to userweb

To build and deploy the app to LNL's production environment, use these commands:

```console
foo@bar:~/lnl/workorder-wizard$ node_modules/@angular/cli/bin/ng build --prod --base-href '/workorder/' --deploy-url '/workorder/'
foo@bar:~/lnl/workorder-wizard$ rsync -avz --update --checksum dist/workorder-wizard/ lnl@linux.wpi.edu:/ifs/home/lnl/public_html/workorder
```

Then `ssh` into the CCC server and manually delete any old files in `~/public_html/workorder/` that are not part of the latest version you just copied over.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
