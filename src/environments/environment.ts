export const environment = {
     production: false,
     firebaseConfig: {
      apiKey: "process.env._APP_FIREBASE_API_KEY",
      authDomain: "process.env._APP_FIREBASE_AUTH_DOMAIN",
      databaseURL: "process.env._APP_FIREBASE_DATABASE_URL",
      projectId: "process.env._APP_FIREBASE_PROJECT_ID",
      storageBucket:" process.env._APP_FIREBASE_STORAGE_BUCKET",
      messagingSenderId: "process.env._APP_FIREBASE_MESSAGING_SENDER_ID",
      appId: "process.env._APP_FIREBASE_APP_ID"
    }
   };
