Ueno Internal App
=================

Internal app for Ueno

Libraries
  - **native-navigation** for awesome navigating library
  - **mobx** and **mobx-react** for easy state management
  - **graphql** for data fetching layer
  - **codepush** for over-the-air updates of non-native code and resources.
  - **firebase-oauth** for social authentication

Getting started
===============

```bash
npm install -g react-native-cli
git clone
yarn install
yarn start

# Develop
react-native run-[ios|android]

# Test
fastlane [ios|android] test

# Build
fastlane [ios|android] [qa|beta|release]
```

Pipeline
========

## Fastlane (for iOS)
  - Manage Provisioning profiles with **sigh**
  - Run tests with **scan**
  - Build and package the app with **gym**
  - Deploy and manage beta releases to TestFlight with **pilot**
  - Maybe use **boarding** for easy installs without publishing.
  - App screenshots with **snapshot** ?

## Fastlane (for Android)
  - Publish to Play Store with **supply**
  - App screenshots with **screengrab** ?

## Bitrise for continuous integration.
 - Runs on every commit pushed to GitHub
 - Builds a QA version of the app using fastlane.
 - By default only updates via code-push, but full build can be done with flag in commit message.

## Azure Mobile Center
 - Tests
 - Analytics
 - Crash reports
 - Code Push management
 - Push Notifications


native-navigation issues in android
===================================

Doesn't work to hide the navbar. (its a native one, android changed something).
Workaround:

```js
// ./node_modules/native-navigation/lib/android/src/main/res/layout/fragment_react_native.xml
android:layout_marginTop="?attr/actionBarSize" // Remove this line

// ./node_modules/native-navigation/lib/android/src/main/java/com/airbnb/android/react/navigation/ReactNativeFragment.java
private void reconcileNavigationProperties() {
  getImplementation().reconcileNavigationProperties(
          this,
          getToolbar(),
          activity.getSupportActionBar(), // <--- Change from null to this
          this.previousConfig,
          this.renderedConfig,
          false
  );
}
```
