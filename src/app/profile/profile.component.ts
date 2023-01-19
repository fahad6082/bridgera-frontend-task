import { ProfileService } from './../servics/profile.service';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @ViewChild('addModalButton') addModalButton: ElementRef;
  @ViewChild('closeAddModalButton') closeAddModalButton: ElementRef;
  @ViewChild('closeEditModalButton') closeEditModalButton: ElementRef;

  public users: any[] = [];
  public user: string;

  constructor(
    private _profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this._profileService
      .list()
      .subscribe(
        res => this.users = res.payload
      );
  }

  openAddModal(user: any) {
    this.user = user;
    this.addModalButton.nativeElement.click();
  }

  onUserAdd(ev) {
    this.closeAddModalButton.nativeElement.click();
    this.users.unshift(ev);
  }

  onUserEdit(ev) {
    this.closeEditModalButton.nativeElement.click();
    this.getUsers();
  }

  deleteUser(id: string) {
    const text = "Do you really want to delete this user?";
    if (!confirm(text)) return;

    const params = {id}
    this._profileService
      .delete(params)
      .subscribe(
        res => {
          const index = this.users.findIndex(user => user._id === id);
          if (index !== -1) this.users.splice(index, 1);
        }
      );
  }
}
