import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  @ViewChild('closeButton') closeButton: any
  @ViewChild('closeButtonUpdate') closeButtonUpdate: any

  successMsg: string = ''

  allUsers : any = []
  user: any = []

  constructor(private afStore: AngularFirestore, private router:Router, private userServ: UserService) {
    this.userServ.getUsersData().subscribe(data => this.allUsers = data)
  }

  ngOnInit(): void {
  }


  addNewUser(form: NgForm) {
    let data = form.value
    this.userServ.addUser(data.Email, data.Password).then(user => {
      this.afStore.collection("users").doc(user.user?.uid).set({
        Name: data.Name,
        Email: data.Email,
        ID: user.user?.uid,
        GroupId: data.GroupId,
      }).then(() => {
        this.router.navigate(['/users'])
        this.closeButton.nativeElement.click()
        this.successMsg = "user is Added Successfully"
      })
    })
  }

  selectUser(id:string) {
    this.userServ.getUserData(id).then(data => {
      this.user = data.data()
    })
  }

  updateUser(updateData: NgForm) {
    let data = updateData.value
    this.afStore.collection("users").doc(data.userID).update({
      Name: data.Name,
      Email: data.Email,
      GroupId: data.GroupId
    }).then(() => {
      this.closeButtonUpdate.nativeElement.click()
      this.successMsg = "user is Update Successfully"
    })
  }

  delete(id:string) {
    this.userServ.deleteUser(id).then(() => {
      this.successMsg = "User Deleted Successfully"
    })
  }

}
