import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/Auth/auth.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  allUsers : any = []
  getUsers?: Subscription
  allCategories : any = []
  getCategories?: Subscription
  allProducts: any = []
  getProducts?: Subscription

  constructor(private userServ: UserService, private catServ: CategoryService, private proServ: ProductService) {

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
}
