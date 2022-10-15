# Sso Theme (Maven Build)

This directory contains the Maven build for the Sso theme. It allows the theme to be built as a JAR which can be included when running the Sso server.

## Building

```bash
mvn install
```

## Deployment

First build the this repository with the instructions above, then [build the Sso sever](https://github.com/sso/sso/blob/main/docs/building.md). Start the Sso server and navigate to `Realm Settings` ➡️ `Themes` and set admin theme to `sso.v2`.
