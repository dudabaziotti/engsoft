import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { getAuth, signOut } from 'firebase/auth';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  currentUser: any = null;

  menuItems = [
    { icon: 'home', label: 'Feed', route: '/feed', active: true },
    { icon: 'timer', label: 'Sala de Foco', route: '/focus-room', active: false },
    { icon: 'person', label: 'Perfil', route: '/perfil', active: false },
  ];

  constructor(private router: Router, private afAuth: AngularFireAuth, private db: AngularFirestore,) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.currentUser = null;
        return;
      }

      this.db.collection('users')
        .doc(user.uid)
        .valueChanges()
        .subscribe(userDoc => {
          this.currentUser = {
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
            displayName: user.displayName,
            ...(userDoc || {}) 
          };
        });
    });

    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.menuItems.forEach(item => {
        item.active = currentRoute.startsWith(item.route);
      });
    });
  }

  navigateTo(item: any): void {
    // Desativa todos os itens
    this.menuItems.forEach(i => i.active = false);
    // Ativa o item clicado
    item.active = true;
    
    // Navega para a rota
    this.router.navigate([item.route]);
  }

  logout(): void {
    const auth = getAuth();
    signOut(auth).then(() => {
      this.router.navigate(['/login']);
    }).catch((error) => {
      console.error('Erro ao fazer logout:', error);
    });
  }
}