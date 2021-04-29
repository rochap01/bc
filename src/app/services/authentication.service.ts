import {Injectable, NgZone} from '@angular/core';
import {auth} from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {User} from '../model/user';
import {AlertService} from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any; // Save logged in user data
  criando = false;

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    private alertService: AlertService,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  SignIn(email, password) {
    this.criando = true;
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          if (result.user.email === 'coordenador@blococonceitual.com') {
            this.router.navigate(['coord/home']);
          } else {
            this.router.navigate(['prof/home']);
          }
          this.criando = false;
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        this.criando = false;
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email, password, name) {
    this.criando = true;
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.SetUserData(result.user);

        this.afAuth.auth.currentUser.updateProfile({
          displayName: name
        }).then(() => {
          this.SignOut();
          this.criando = false;
          this.alertService.showSuccess('Conta criada com sucesso. Entre com seu email e senha para entrar.');
        }).catch(err => this.SignOut());
      }).catch((error) => {
        this.criando = false;
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null) ? true : false;
  }


  get getUID(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.uid;
  }

  get getEmail(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.email : '';
  }

  get getDisplayNmae(): string {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.displayName : '';
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
