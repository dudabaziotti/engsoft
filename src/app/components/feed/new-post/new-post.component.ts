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
  selectedImageFile: File | null = null;
  selectedPdfFile: File | null = null;
  imagePreviewUrl: string | null = null;
  isPosting: boolean = false;

  constructor(private firestore: AngularFirestore) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

   onPdfSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedPdfFile = file;
    } else {
      alert('Por favor, selecione um arquivo PDF.');
    }
  }


  removeImage(): void {
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
  }

  removePdf(): void {
    this.selectedPdfFile = null;
  }

createPost(): void {
    const user = getAuth().currentUser;
    if (!user || !this.newPostContent.trim()) return;

    this.isPosting = true;

    const postId = this.firestore.createId();
    const postRef = this.firestore.collection('posts').doc(postId);

    const newPost = {
      author: {
        uid: user.uid,
        name: user.displayName,
        photoUrl: user.photoURL
      },
      content: this.newPostContent.trim(),
      createdAt: new Date(),
      likesCount: 0,
      commentsCount: 0,
      imageUrl: '', 
      pdfUrl: '',
      pdfName: ''  
    };

    if (this.selectedImageFile) {
      const storageRef = ref(getStorage(), `posts/${postId}/image.jpg`);
      uploadBytes(storageRef, this.selectedImageFile).then(() => {
        getDownloadURL(storageRef).then(url => {
          newPost.imageUrl = url;
          this.savePost(newPost, postRef); 
        });
      }).catch(error => {
        console.error('Erro ao fazer upload da imagem:', error);
        this.isPosting = false;
      });
    }

    if (this.selectedPdfFile) {
      const storageRef = ref(getStorage(), `posts/${postId}/file.pdf`);
      uploadBytes(storageRef, this.selectedPdfFile).then(() => {
        getDownloadURL(storageRef).then(url => {
          postRef.set({
            ...newPost,
            pdfUrl: url,
            pdfName: this.selectedPdfFile!.name // Agora salvamos o nome do PDF
          }).then(() => {
            this.resetForm();
            this.postCreated.emit();
          });
        });
      }).catch(error => {
        console.error('Erro ao fazer upload do PDF:', error);
        this.isPosting = false;
      });
    }

    if (!this.selectedImageFile && !this.selectedPdfFile) {
      this.savePost(newPost, postRef);
    }
  }

savePost(newPost: any, postRef: any) {
    postRef.set(newPost).then(() => {
      this.resetForm();
      this.postCreated.emit();
    }).catch((error: any) => {
      console.error('Erro ao criar post:', error);
      this.isPosting = false;
    });
}

resetForm(): void {
    this.newPostContent = '';
    this.selectedImageFile = null;
    this.selectedPdfFile = null;
    this.imagePreviewUrl = null;
    this.isPosting = false;
}
}