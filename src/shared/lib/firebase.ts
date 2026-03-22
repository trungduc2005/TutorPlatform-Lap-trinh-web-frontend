import firebase from "firebase/compat/app";
import "firebase/compat/firestore"
import { env } from "./env";

const firebaseConfig = {
    apiKey: env.firebaseApiKey,
    authDomain: env.firebaseAuthDomain,
    projectId: env.firebaseProjectId,
    storageBucket: env.firebaseStorageBucket,
    messagingSenderId: env.firebaseMessagingSenderId,
    appId: env.firebaseAppId,
    measurementId: env.firebaseMeasurementId,
};


if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();
