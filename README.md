# Overview

As a software engineer, I wanted to deepen my understanding of mobile development and cloud-integrated applications. This project gave me hands-on experience building a full-stack mobile app from scratch, connecting a React Native frontend to a live cloud database, and implementing real user authentication.

**Personal Expense Tracker** is a React Native mobile app built with Expo that allows users to track their income and expenses in real time. Users create an account, log in, and manage their personal financial transactions — adding, editing, and deleting entries that are stored in the cloud and synced instantly. The app shows a live balance, total income, and total expenses on the home screen.

[Software Demo Video] https://youtu.be/69Ejb2H1pfQ

# Cloud Database

This app uses **Firebase Firestore**, a NoSQL cloud database provided by Google. Firestore stores data in collections of documents, offers real-time sync, and integrates directly with Firebase Authentication to secure data per user.

**Database structure:**

Collection: `transactions`

Each document contains:

`userId`
`title`
`category`
`amount`
`date`
`isExpense`
`createdAt`

Each user only has access to documents where `userId` matches their own UID, enforced by Firestore security rules.

# Development Environment

- **Editor:** Visual Studio Code
- **Runtime:** Node.js with npm
- **Framework:** Expo SDK 54 (managed workflow)
- **Device testing:** Expo Go app on Android

**Language:** TypeScript

**Libraries and tools:**

- `react-native` 0.81 — core mobile UI framework
- `expo` — build tooling and native API access
- `firebase` 12 — Firebase JS SDK for Auth and Firestore
- `@react-navigation/native` + `@react-navigation/native-stack` — screen navigation
- `@react-native-async-storage/async-storage` — local persistence for Firebase auth session
- `react-native-gesture-handler` — gesture support for navigation

# Useful Websites

- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)

# Future Work

- Add Google Sign-In as an additional authentication method
- Add a monthly budget limit with alerts when approaching the limit
