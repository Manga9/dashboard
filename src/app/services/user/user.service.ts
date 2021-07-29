import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afStore: AngularFirestore, private afAuth: AngularFireAuth) {}

  getUsersData() {
   return this.afStore.collection("users").valueChanges();
  }

  getUserData(id: string) {
    return this.afStore.collection("users").ref.doc(id).get();
  }

  addUser(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  deleteUser(id:string) {
    return this.afStore.collection("users").doc(id).delete()
  }
}
