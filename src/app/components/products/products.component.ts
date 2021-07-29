import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CategoryService } from 'src/app/services/category/category.service';
import { UserService } from 'src/app/services/user/user.service';
import { AngularFireUploadTask, AngularFireStorageReference, AngularFireStorage } from '@angular/fire/storage';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  allUsers : any = []
  getUsers?: Subscription
  allCategories : any = []
  getCategories?: Subscription

  task?: AngularFireUploadTask
  ref?: AngularFireStorageReference
  imgUrl: string = ''
  percentage?: Observable<number | undefined>

  @ViewChild('closeButton') closeButton: any
  @ViewChild('closeButtonUpdate') closeButtonUpdate: any

  successMsg: string = ''
  allProducts: any = []
  product: any = []
  getProducts?: Subscription

  constructor(private userServ: UserService, private catServ: CategoryService, private afStore: AngularFirestore, private afStorage: AngularFireStorage, private router: Router, private proServ: ProductService) {

    this.getUsers = this.userServ.getUsersData().subscribe(data=> this.allUsers = data)

    this.getCategories = this.catServ.getCategoriesData().subscribe(data=> {
      this.allCategories = data.map(element => {
        return element.payload.doc.data()
      })
    })

    this.getProducts = this.proServ.getProductsData().subscribe(data => {
      this.allProducts = data.map(element => {
        return element.payload.doc.data()
      })
    })

  }

  ngOnInit(): void {
  }


  uploadImage(event: any) {
    const id = Math.random().toString(36).substr(2, 9);
    this.ref = this.afStorage.ref(id + '_' + event.target.files[0].name)
    this.task = this.ref.put(event.target.files[0])
    this.percentage = this.task.percentageChanges()
    this.task.then((data)=> {
      data.ref.getDownloadURL().then((url) => {
        this.imgUrl = url
      })
    })
  }

  addNewProduct(form: NgForm) {
    let data = form.value
    this.afStore.collection("products").add({
      Name: data.Name,
      Description: data.Description,
      Price: data.Price,
      userID: data.userId,
      catID: data.categoryId,
      Image: this.imgUrl,
      ID: Math.random().toString(36).substr(2, 9)
    }).then(() => {
      this.router.navigate(['/products'])
      form.reset()
      this.closeButton.nativeElement.click()
      this.successMsg = "Product is Added Successfully"
  })

  this.getProducts = this.proServ.getProductsData().subscribe((data) => {
    data.map(element => {
      this.afStore.collection("products").doc(element.payload.doc.id).update({
        ID: element.payload.doc.id
      })
    })
  })
  }
  selectProduct(id:string) {
    this.proServ.getProductData(id).then(data => {
      this.product = data.data()
    })
  }

  updateProduct(updateData: NgForm) {
    let data = updateData.value
    this.afStore.collection("products").doc(data.ID).update({
      Name: data.Name,
      Description: data.Description,
      Price: data.Price,
      userID: data.userId,
      catID: data.categoryId
    }).then(() => {
      this.closeButtonUpdate.nativeElement.click()
      this.successMsg = "Product is Updated Successfully"
    })
  }

  delete(id:string) {
    this.proServ.deleteProduct(id).then(() => {
      this.successMsg = "Product Deleted Successfully"
    })
  }

  ngOnDestroy(): void {
    this.getCategories?.unsubscribe()
    this.getUsers?.unsubscribe()
    this.getProducts?.unsubscribe()
  }
}
