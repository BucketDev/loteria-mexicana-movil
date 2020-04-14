import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User as FireBaseUser} from 'firebase/app';
import {LotteryUser} from '../../models/lottery-user.class';
import {Router} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {AngularFirestore} from "@angular/fire/firestore";
import {NavController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {

  lotteryUser: LotteryUser;
  $userRetrieved = new ReplaySubject<boolean>(1);

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private navController: NavController,
              private db: AngularFirestore) {
    afAuth.authState.subscribe((user: FireBaseUser) => {
      if (user) {
        this.db.collection('/users').doc(user.uid).valueChanges().subscribe(document => {
          if (document) {
            this.session = {...(document as LotteryUser), uid: user.uid};
            if (this.router.url.startsWith('/login')) {
              this.navController.navigateRoot(['/dashboard']);
            }
          }
        });
      } else {
        this.session = null;
        this.navController.navigateRoot(['/login']);
      }
    });
  }

  set session(user: LotteryUser | null) {
    this.lotteryUser = user;
    this.$userRetrieved.next(!!user);
  }

  googleLogin = () => {
    const googleProvider = new auth.GoogleAuthProvider().setCustomParameters({
      prompt: 'select_account'
    });
    this.afAuth.auth.signInWithPopup(googleProvider).then(console.log);
  }

  emailSignIn = (email: string, password: string) => this.afAuth.auth.signInWithEmailAndPassword(email, password);

  emailSignUp = (email: string, password: string) => this.afAuth.auth.createUserWithEmailAndPassword(email, password);

  signOut = () => this.afAuth.auth.signOut();

}
