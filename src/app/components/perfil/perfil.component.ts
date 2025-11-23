import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { UserInterface } from '../../../shared/interfaces/user-interface';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  perfilForm: FormGroup;
  photoUrl: string | null = '';
  uid: string = '';
  public user: UserInterface | null = null;

  modalError = false;
  modalSave = false;
  modalInvalidForm = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private db: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.perfilForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      photoUrl: ['']
    });
  }

  async ngOnInit(): Promise<void> {
    // pega o usuário logado diretamente do Firebase
    const firebaseUser = await this.auth.getCurrentUserAsync();

    if (!firebaseUser) {
      console.error('Nenhum usuário logado');
      this.modalError = true;
      return;
    }

    this.uid = firebaseUser.uid;

    // escuta o documento do usuário no Firestore
    this.db
      .collection<UserInterface>('users')
      .doc(this.uid)
      .valueChanges()
      .subscribe(user => {
        if (user) {
          this.user = user;
          this.photoUrl = user.photoUrl || '';

          this.perfilForm.patchValue({
            name: user.name || '',
            email: user.email || '',
            photoUrl: this.photoUrl || ''
          });
        }
      });
  }

  async onSave(): Promise<void> {
    if (!this.uid) {
      this.modalError = true;
      return;
    }

    if (this.perfilForm.valid) {
      const cleanedData = this.cleanData(this.perfilForm.getRawValue());

      try {
        await this.db.collection('users').doc(this.uid).update(cleanedData);
        this.modalSave = true;
      } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        this.modalError = true;
      }
    } else {
      this.modalInvalidForm = true;
    }
  }

  closeModal(): void {
    this.modalError = false;
    this.modalInvalidForm = false;
    this.modalSave = false;
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file && this.uid) {
      const filePath = `users/${this.uid}/profile.jpg`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);

      task.snapshotChanges().subscribe({
        complete: async () => {
          try {
            this.photoUrl = await fileRef.getDownloadURL().toPromise();
            this.perfilForm.patchValue({ photoUrl: this.photoUrl });
            await this.onSave(); // já salva o novo photoUrl no Firestore
          } catch (error) {
            console.error('Erro ao obter o URL de download:', error);
            this.modalError = true;
          }
        }
      });
    }
  }

  openFileDialog(event: MouseEvent): void {
    event.preventDefault();
    this.fileInput.nativeElement.click();
  }

  private cleanData(data: { [key: string]: any }): { [key: string]: any } {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {} as { [key: string]: any });
  }
}