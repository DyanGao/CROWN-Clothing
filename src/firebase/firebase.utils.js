import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
    apiKey: "AIzaSyDlISwJNtMh2Nk4Kei0ClTWvGnE9eXGDjo",
    authDomain: "crown-db-16212.firebaseapp.com",
    databaseURL: "https://crown-db-16212.firebaseio.com",
    projectId: "crown-db-16212",
    storageBucket: "crown-db-16212.appspot.com",
    messagingSenderId: "750621953717",
    appId: "1:750621953717:web:bf020489ae4a5db4c2f8fc",
    measurementId: "G-GCD1H1M9YG"
}
  
export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`)
  const snapShot = await userRef.get()

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date()

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      })
    } catch (error) {
      console.log('error creating user', error.message)
    }
  }
  return userRef
}

firebase.initializeApp(config)

export const auth = firebase.auth()
export const firestore = firebase.firestore()

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account'})
export const signInWithGoogle = () => auth.signInWithPopup(provider)

export default firebase