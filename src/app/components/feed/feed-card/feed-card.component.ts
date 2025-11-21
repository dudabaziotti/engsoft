import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-feed-card',
  templateUrl: './feed-card.component.html',
  styleUrls: ['./feed-card.component.scss']
})
export class FeedCardComponent {
  @Input() post: any;
  auth = getAuth();
  showComments: boolean = false;
  newComment: string = '';
  comments: any[] = [];
  loadingLike = false;

  constructor(private firestore: AngularFirestore) {}

  ngOnChanges() {
  if (this.post) {
    this.post = { ...this.post };
  }
}

  getPostDate(timestamp: any): Date {
    if (timestamp?.toDate) {
      return timestamp.toDate();
    }
    return new Date(timestamp);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Agora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
    if (this.showComments && this.comments.length === 0) {
      this.loadComments();
    }
  }

  loadComments(): void {
    if (!this.post.id) return;
    
    this.firestore
      .collection('posts')
      .doc(this.post.id)
      .collection('comments', ref => ref.orderBy('createdAt', 'asc'))
      .valueChanges({ idField: 'id' })
      .subscribe((comments: any[]) => {
        this.comments = comments.map(comment => ({
          ...comment,
          createdAt: comment.createdAt?.toDate() || new Date()
        }));
      });
  }

  async toggleLike() {
    if (this.loadingLike || !this.post?.id) return;

    const user = this.auth.currentUser;
    if (!user) return;

    this.loadingLike = true;
    const likeRef = this.firestore.doc(`posts/${this.post.id}/likes/${user.uid}`);

    const alreadyLiked = this.post.liked === true;

    try {
      if (!alreadyLiked) {
        await likeRef.set({ userId: user.uid });
        this.post.likesCount++;
        this.post.liked = true;
      } else {
        await likeRef.delete();
        this.post.likesCount--;
        this.post.liked = false;
      }
    } catch (error) {
      console.error("Erro ao alterar like:", error);
    }

    this.loadingLike = false;
  }

  addComment(): void {
    const user = getAuth().currentUser;
    if (!user || !this.newComment.trim() || !this.post.id) return;

    const postRef = this.firestore.collection('posts').doc(this.post.id);
    const commentRef = postRef.collection('comments').doc();

    const newCommentData = {
      author: {
        name: user.displayName,
        photoUrl: user.photoURL
      },
      content: this.newComment,
      createdAt: new Date()
    };

    commentRef.set(newCommentData).then(() => {
      postRef.update({
        commentsCount: this.post.commentsCount + 1
      });
      this.post.commentsCount++;
      this.newComment = '';
    });
  }

  sharePost(): void {
    console.log('Compartilhar post:', this.post.id);
  }
}