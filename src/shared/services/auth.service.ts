import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { environment } from '../../environments/environment';
import { UserInterface } from '../interfaces/user-interface';
import { map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string | null = null;

  showConfirmEmailModal: boolean = false;
  showBlockedModal: boolean = false;
  showWrongModal: boolean = false;
  showCadastroModal: boolean = false;
  showSuccessModal: boolean = false;

  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }

  logout() {
    this.fireauth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch(err => {
      alert(err.message);
    });
  }

  cadastro(name: string, email: string, password: string, confirmPassword: string, photo: File) {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem. Por favor, tente novamente.');
      return;
    }

    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then(async userCredential => {
        const user = userCredential.user;
        if (user) {
          const createdAt = firebase.firestore.FieldValue.serverTimestamp();
          const storageRef = firebase.storage().ref();
          const photoRef = storageRef.child(`users/${user.uid}/profile.jpg`);
          await photoRef.put(photo);
          const photoUrl = await photoRef.getDownloadURL();

          await user.updateProfile({
            displayName: name,
            photoURL: photoUrl || null
          });
          await this.salvarDadosUsuario(user.uid, name, email, photoUrl, createdAt);
          firebase.auth().useDeviceLanguage();
          user.sendEmailVerification();
          this.showSuccessModal = true;
          this.fireauth.signOut();
        }
      })
      .catch(error => {
        console.error('Erro ao criar usuário:', error);
        alert('Erro ao criar conta: ' + error.message);
      });
  }

  redefinirSenha(email: string) {
    this.fireauth.sendPasswordResetEmail(email);
  }

  login(email: string, password: string, rememberMe: boolean) {
    this.fireauth.signInWithEmailAndPassword(email, password)
      .then(async res => {
        if (res.user?.emailVerified) {
          const userDoc = await this.firestore.collection('users').doc(res.user?.uid).get().toPromise();
          const userData = userDoc?.data() as { isActive: boolean } | undefined;
          if (userData && userData.isActive) {
            const userSnapshot = await this.firestore.collection('users', ref => ref.where('email', '==', res.user?.email)).get().toPromise();

            await this.firestore.collection('users').doc(userSnapshot?.docs[0].id).update({
              lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });

            if (userSnapshot && !userSnapshot.empty) {
              this.router.navigate(['/feed']);
            } else {
              alert('Usuário não encontrado.');
            }  
          } else {
            this.openBlockedModal();
          }
        } else {
          this.openConfirmEmailModal();
        }
      })
      .catch(err => {
        this.openWrongModal();
      });
  }

  async cadastrarNovoUsuarioComGoogle(user: any) {
    const createdAt = firebase.firestore.FieldValue.serverTimestamp();

    const userData: UserInterface = {
      uid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      createdAt: createdAt,
      photoUrl: user.photoURL || '',
      isActive: true,
      tipo: "Usuario",
      lastLogin: createdAt,
      bio: user.bio,
      interesse: user.interesse
    };

    await this.firestore.collection('users').doc(user.uid).set(userData);
  }

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result: any = await this.fireauth.signInWithPopup(provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      if (user && user.emailVerified) {
        const userSnapshot = await this.firestore.collection('users').ref
          .where('email', '==', user.email)
          .get();

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data() as { isActive: boolean };

          if (userData.isActive) {
            await this.firestore.collection('users').doc(user.uid).update({
              lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });

            this.router.navigate(['/home']);
          } else {
            this.openBlockedModal();
            await this.fireauth.signOut();
          }
        } else {
          await this.cadastrarNovoUsuarioComGoogle(user);
          this.router.navigate(['/home']);
        }
      } else {
        this.openConfirmEmailModal();
        await this.fireauth.signOut();
      }
    } catch (err) {
      this.openWrongModal();
      await this.fireauth.signOut();
    }
  }

  salvarDadosUsuario(uid: string, name: string, email: string, photoUrl: string, createdAt: firebase.firestore.FieldValue) {
    return this.firestore.collection('users').doc(uid).set({
      uid,
      name,
      email,
      photoUrl,
      createdAt,
      lastLogin: createdAt,
      tipo: "Usuario",
      isActive: true
    });
  }

  isAuthenticated(): boolean {
    return this.fireauth.authState != null;
  }

  public getCurrentUser(): firebase.User | null {
    return firebase.auth().currentUser;
  }

  public getCurrentUserAsync(): Promise<firebase.User | null> {
    return new Promise((resolve) => {
      const user = firebase.auth().currentUser;
      if (user) {
        resolve(user);
      } else {
        firebase.auth().onAuthStateChanged((user) => {
          resolve(user);
        });
      }
    });
  }

  getUserType(uid: string): Observable<string | null> {
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map((user: any) => user ? user.tipo : null)
    );
  }

  desactivateUser(userId: string): Promise<void> {
    return this.fireauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.getUserType(user.uid).pipe(
            switchMap(userType => {
              if (userType === 'Administrador') {
                return this.firestore.collection('users').doc(userId).update({
                  isActive: false
                }) as Promise<void>;
              } else {
                return Promise.reject(new Error('Permissão negada!'));
              }
            })
          ).toPromise();
        } else {
          return Promise.reject('Usuário não autenticado!');
        }
      })
    ).toPromise();
  }


  activateUser(userId: string): Promise<void> {
    return this.fireauth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.getUserType(user.uid).pipe(
            switchMap(userType => {
              if (userType === 'Administrador') {
                return this.firestore.collection('users').doc(userId).update({
                  isActive: true
                }) as Promise<void>;
              } else {
                return Promise.reject(new Error('Permissão negada!'));
              }
            })
          ).toPromise();
        } else {
          return Promise.reject('Usuário não autenticado!');
        }
      })
    ).toPromise();
  }

  openConfirmEmailModal() {
    this.showConfirmEmailModal = true;
  }

  openBlockedModal() {
    this.showBlockedModal = true;
  }

  openWrongModal() {
    this.showWrongModal = true;
  }

  openCadastroModal() {
    this.showCadastroModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/login']);
  }

  closeModal() {
    this.showConfirmEmailModal = false;
    this.showBlockedModal = false;
    this.showWrongModal = false;
    this.showCadastroModal = false;
  }
}