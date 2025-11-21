import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss']
})
export class NewPostComponent {
  @Output() postCreated = new EventEmitter<void>();
  
  newPostContent: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isPosting: boolean = false;

  constructor(private firestore: AngularFirestore) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  createPost(): void {
    const user = getAuth().currentUser;
    if (!user || !this.newPostContent.trim()) return;

    this.isPosting = true;

    const postId = this.firestore.createId();
    const postRef = this.firestore.collection('posts').doc(postId);

    const newPost = {
      author: {
        name: user.displayName,
        photoUrl: user.photoURL
      },
      content: this.newPostContent.trim(),
      createdAt: new Date(),
      likesCount: 0,
      commentsCount: 0,
      imageUrl: ''
    };

    if (this.selectedFile) {
      const storageRef = ref(getStorage(), `posts/${postId}/image.jpg`);
      uploadBytes(storageRef, this.selectedFile).then(() => {
        getDownloadURL(storageRef).then(url => {
          postRef.set({
            ...newPost,
            imageUrl: url
          }).then(() => {
            this.resetForm();
            this.postCreated.emit();
          });
        });
      }).catch(error => {
        console.error('Erro ao fazer upload da imagem:', error);
        this.isPosting = false;
      });
    } else {
      postRef.set(newPost).then(() => {
        this.resetForm();
        this.postCreated.emit();
      }).catch(error => {
        console.error('Erro ao criar post:', error);
        this.isPosting = false;
      });
    }
  }

  resetForm(): void {
    this.newPostContent = '';
    this.selectedFile = null;
    this.previewUrl = null;
    this.isPosting = false;
  }
}