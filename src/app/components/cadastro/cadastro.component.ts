import { Component } from '@angular/core';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {

  name: string = '';
  email: string ='';
  password: string = '';
  confirmPassword: string = '';
  isFormValid: boolean = false;  
  photoUrl: string | null = null;
  selectedFile: File | null = null;


  constructor(public auth: AuthService, private router: Router, private storage: AngularFireStorage, private firestore: AngularFirestore) {}

  validateForm() {
    this.isFormValid = 
    this.name !== '' &&
    this.email !== '' &&
    this.selectedFile !== null &&
    this.password !== '' &&
    this.confirmPassword !== '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.querySelector('.profile-photo') as HTMLImageElement;
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  

  cadastro() {
    this.validateForm();
    if (this.isFormValid) {
      if (this.password === this.confirmPassword) {
        if (this.selectedFile) {
          this.auth.cadastro(this.name, this.email, this.password, this.confirmPassword, this.selectedFile);
        } else {
          alert('Por favor, selecione uma foto.');
        }
      } else {
        alert('As senhas não coincidem. Por favor, tente novamente.');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }

}
