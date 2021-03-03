import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    ) {
      this.loggedIn = !!this.auth.currentUser;
      this.auth.onAuthStateChanged(res => {
        this.loggedIn = !!res;
      });
    }

  userAuthState() {
    return this.auth.authState;
  }

  signUp(email: string, pw: string) {
    return this.auth.createUserWithEmailAndPassword(email, pw);
  }

  signIn(email: string, pw: string) {
    return this.auth.signInWithEmailAndPassword(email, pw);
  }

  logout() {
    return this.auth.signOut();
  }

  async signInWithPopup(callback) {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.auth.signInWithPopup(provider);
    return this.updateUserData(credential.user, callback);
  }

  updateUserData({ uid, email, displayName, photoURL }: User, callback) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL
    };

    callback(this.router);
    return userRef.set(data, { merge: true });
  }

  isLoggedIn() {
    return this.loggedIn;
 }
}
