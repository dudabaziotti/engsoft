import { Component, OnInit } from '@angular/core';
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUser = getAuth().currentUser;
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