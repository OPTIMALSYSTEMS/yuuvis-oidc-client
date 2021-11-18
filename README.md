# Building a custom client using OpenID connect

Notice: This application is reliant on a beta version of `@yuuvis/framework`. Feature is available since version `2.1.0-beta.6`.

This project will demonstrate how to create a custom client using the `@yuuvis/framework` library that connects to the backend using OpenID Connect:

## Create and setup project

- Create a new project using Angular CLI running `ng new yuuvis-oidc-client`. 
- Run `npm i -S @yuuvis/framework` to add the yuuvis framework dependency.  
- Add build config to `angular.json` to copy translations from yuuvis framework:
```json
// line: 32
{
    "glob": "**/*",
    "input": "node_modules/@yuuvis/framework/i18n",
    "output": "./assets/@yuuvis/i18n/"
}
```
- Import `YuvFrameworkModule`:
```ts
// app.module.ts
...
imports: [
    ...,
    YuvFrameworkModule.forRoot({translations: ['assets/default/i18n/', 'assets/@yuuvis/i18n/']}),
    ...
],
  ...
```
- Add yuuvis framework styles to projects `styles.scss`:
```scss
// styles.scss
@import "~@yuuvis/framework/framework.css";
```
- Setup configuration and translations (take a look at the assets folder. The `default` directory will contain the required `main.json` as well as a folder for translations)

## Prepare Keycloak
For connecting to a certain tenant we need to configure a client in the corresponding Keycloak realm: You can import `doc/spa-client.json` into your realm. Make sure to configure the clients `Redirect URIs` to match your environment.

## Connect to the backend
The default behaviour of the `@yuuvis/core` library (which is the foundation of `@yuuvis/framework`) is to directly try to connect to the backend. This will fail in the first place so you'll see a couple of error messages in the console. But that's fine.

To statically setup a connection using OpenID Connect you just need to set the OpenID configuration and then initialize the core again:
```ts
// app.module.ts
...
imports: [
    ...,
    YuvFrameworkModule.forRoot({
      oidc: {
        host: '...',
        tenant: '...',
        issuer: '...',
        clientId: '...',
    },
      translations: ['assets/default/i18n/', 'assets/@yuuvis/i18n/']}),
    ...
],
  ...
```

To dynamically setup a connection using OpenID Connect you just need to set the OpenID configuration and then initialize the core again:
```ts
// app.module.ts
...
imports: [
    ...,
    YuvFrameworkModule.forRoot({
      oidc: JSON.parse(localStorage.getItem(AppComponent.OIDC) || '{}'),
      translations: ['assets/default/i18n/', 'assets/@yuuvis/i18n/']}),
    ...
],
  ...
```

```ts
// app.component.ts
static OIDC = 'app.oidc.config';

constructor(
    @Inject(CORE_CONFIG) private coreConfig: CoreConfig,
    private coreInit: CoreInit
  ) {}

connect() {
    this.coreConfig.oidc = {
      host: '...',
      tenant: '...',
      issuer: '...',
      clientId: '...',
    };
    localStorage.setItem(AppComponent.OIDC, JSON.stringify(this.coreConfig.oidc));
    this.coreInit.initialize();
}

```

If you take a look at `app.component.ts` it should be obvious how you could extend this in a way that fits your needs. To disconnect from the backend run logout function provided by the `UserService`:

```ts
// app.component.ts

constructor(private userService: UserService) {}

logout() {
    localStorage.removeItem(AppComponent.OIDC);
    this.userService.logout();
}

```

