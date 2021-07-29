import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) {
  }

  signin(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
  }

  signout() {
    return this.afAuth.signOut();
  }

}
