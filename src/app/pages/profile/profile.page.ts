import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FireAuthService} from "../../services/security/fire-auth.service";
import {UsersService} from "../../services/users.service";
import {LotteryUser} from "../../models/lottery-user.class";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/storage";
import {ToastController} from "@ionic/angular";
import {AngularFireAuth} from "@angular/fire/auth";
import {User} from 'firebase/app';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profileFormGroup: FormGroup;
  updating = false;
  loading = true;
  lotteryUser: LotteryUser;
  user: User;
  isCurrentUser: boolean;

  constructor(public fireAuth: FireAuthService,
              private usersService: UsersService,
              private activatedRoute: ActivatedRoute,
              private afStorage: AngularFireStorage,
              private toastController: ToastController,
              private afAuth: AngularFireAuth) {
    const {uid} = activatedRoute.snapshot.params;
    this.usersService.findByUid(uid).subscribe((user: LotteryUser) => {
      this.lotteryUser = user;
      if (uid === fireAuth.lotteryUser.uid) {
        this.isCurrentUser = true;
        this.afAuth.user.subscribe((user) => {
          this.user = user;
          this.loading = false;
        });
      } else {
        this.isCurrentUser = false;
        this.loading = false;
      }
      this.profileFormGroup = new FormGroup({
        displayName: new FormControl(this.lotteryUser.displayName, [Validators.required])
      })
    });
  }

  ngOnInit() { }

  saveProfile = () => {
    this.updating = true;
    const {displayName} = this.profileFormGroup.value;
    this.usersService.update(this.lotteryUser.uid, { displayName }).then(this.showProfileUpdated);
  }

  updatePhoto = (photoInput: HTMLInputElement) => {
    const file: File = photoInput.files.item(0);
    if (file && file.type.startsWith('image')) {
      this.updating = true;
      this.afStorage.storage.ref(`users/${this.lotteryUser.uid}/profile`).child(file.name).put(file)
        .then((task) => task.ref.getDownloadURL().then((photoURL) =>
          this.usersService.update(this.lotteryUser.uid, { photoURL }).then(this.showProfileUpdated)
        ));
    } else {
      this.toastController.create({
        message: 'El archivo no es una imagen',
        duration: 3000
      }).then(toast => toast.present());
    }
  }

  showProfileUpdated = () => this.toastController.create({
    message: 'El perfil fue actualizado exitosamente',
    duration: 3000
  }).then(toast => {
    this.updating = false;
    toast.present();
  })

  verifyEmail = () => {
    this.updating = true;
    this.user.sendEmailVerification()
      .then((data) => this.toastController.create({
        message: 'Se ha enviado un correo de verificación',
        duration: 3000
      }).then(toast => toast.present()))
      .catch((data) => this.toastController.create({
        message: 'Se ha producido un error, intentalo mas tarde',
        color: 'danger',
        duration: 3000
      }).then(toast => toast.present()))
      .finally(() => this.updating = false);
  }

}
