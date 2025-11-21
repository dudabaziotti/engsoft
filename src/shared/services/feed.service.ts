import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private firestore: AngularFirestore) {}

  // Carregar todos os posts (ordem decrescente por data)
  getPosts(): Observable<any[]> {
    return this.firestore.collection('posts', ref => ref.orderBy('createdAt', 'desc')).valueChanges({ idField: 'id' });
  }

  // Criar um novo post
  createPost(postData: any): Promise<void> {
    const postRef = this.firestore.collection('posts').doc();
    return postRef.set(postData);
  }

  // Curtir um post (incrementa o likesCount)
  likePost(postId: string): Promise<void> {
    const postRef = this.firestore.collection('posts').doc(postId);
    return postRef.update({
      likesCount: firebase.firestore.FieldValue.increment(1)
    });
  }

  // Adicionar um comentário em um post
  addComment(postId: string, commentData: any): Promise<void> {
    const commentRef = this.firestore.collection('posts').doc(postId).collection('comments').doc();
    return commentRef.set(commentData);
  }
}