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
    { icon: 'inbox', label: 'Mensagens', route: '/inbox', active: false },
    { icon: 'search', label: 'Buscar', route: '/search', active: false },
    { icon: 'people', label: 'Minha Rede', route: '/network', active: false }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUser = getAuth().currentUser;
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