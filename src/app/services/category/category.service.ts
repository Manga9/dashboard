import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private afStore: AngularFirestore) { }

  getCategoriesData() {
    return this.afStore.collection("categories").snapshotChanges();
   }

   getCategoryData(id: string) {
     return this.afStore.collection("categories").ref.doc(id).get();
   }

   deleteCategory(id:string) {
     return this.afStore.collection("categories").doc(id).delete()
   }
}
