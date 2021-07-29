import { Subscription } from 'rxjs';
import { DeclareFunctionStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit, OnDestroy {
  @ViewChild('closeButton') closeButton: any
  @ViewChild('closeButtonUpdate') closeButtonUpdate: any

  successMsg: string = ''

  allCategories : any = []
  category: any = []
  getCategories?: Subscription
  updateID? :Subscription


  constructor(private afStore: AngularFirestore, private router:Router, private catServ: CategoryService) {
    this.getCategories = this.catServ.getCategoriesData().subscribe(data => {
      this.allCategories = data.map(element => {
        return element.payload.doc.data()
      })
    })
  }

  ngOnInit(): void {}

  addNewCategory(form: NgForm) {
    let data = form.value
    this.afStore.collection('categories').add({
      Name: data.Name,
      CatId: Math.random().toString(36).substr(2, 9)
    }).then(() => {
      this.router.navigate(['/categories'])
      form.reset()
      this.closeButton.nativeElement.click()
      this.successMsg = "Category is Added Successfully"
  })
  this.updateID = this.catServ.getCategoriesData().subscribe((data) => {
    data.map(element => {
      this.afStore.collection("categories").doc(element.payload.doc.id).update({
        CatId: element.payload.doc.id
      })
    })
})
  }

  selectCategory(id:string) {
    this.catServ.getCategoryData(id).then(data => {
      this.category = data.data()
    })
  }

  updateCategory(updateData: NgForm) {
    let data = updateData.value
    this.afStore.collection("categories").doc(data.CatId).update({
      Name: data.Name,
    }).then(() => {
      this.closeButtonUpdate.nativeElement.click()
      this.successMsg = "Category is Update Successfully"
    })
  }

  delete(id:string) {
    this.catServ.deleteCategory(id).then(() => {
      this.successMsg = "Category Deleted Successfully"
    })
  }

  ngOnDestroy(): void {
    this.getCategories?.unsubscribe()
    this.updateID?.unsubscribe()
  }

}

