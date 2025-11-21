import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface RelevantPerson {
  id: string;
  name: string;
  photoUrl: string;
  role: string;
  following?: boolean;
}

interface TrendingPost {
  id: string;
  author: string;
  time: string;
  preview: string;
  tag?: string;
}

@Component({
  selector: 'app-rigthbar',
  templateUrl: './rigthbar.component.html',
  styleUrls: ['./rigthbar.component.scss']
})
export class RigthbarComponent implements OnInit {
  searchQuery: string = '';
  
  relevantPeople: RelevantPerson[] = [
    {
      id: '1',
      name: 'Akash Bhadange',
      photoUrl: 'https://i.pravatar.cc/150?img=1',
      role: 'Cofounder and CEO at Peerlist',
      following: false
    },
    {
      id: '2',
      name: 'Swapnil Patil',
      photoUrl: 'https://i.pravatar.cc/150?img=2',
      role: 'Full Stack Developer',
      following: false
    },
    {
      id: '3',
      name: 'Maria Silva',
      photoUrl: 'https://i.pravatar.cc/150?img=3',
      role: 'Product Designer',
      following: false
    }
  ];

  trendingPosts: TrendingPost[] = [
    {
      id: '1',
      author: 'Ankur Syal',
      time: '22h ago',
      preview: 'This was the peak of electronics. This was also my family\'s first touch screen mobile.',
      tag: '#show'
    },
    {
      id: '2',
      author: 'Tanishq Singla',
      time: '22h ago',
      preview: 'Added a link to my collection - Weekly shelf',
      tag: '#show'
    },
    {
      id: '3',
      author: 'Ankur Syal',
      time: '23h ago',
      preview: 'What\'s the effect of the site missing the \'index/follow\' tag.?',
      tag: '#ask'
    }
  ];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    // this.loadRelevantPeople();
  }

  toggleFollow(person: RelevantPerson): void {
    person.following = !person.following;

    // this.firestore.collection('follows').doc(`${currentUserId}_${person.id}`).set({...});
  }

  searchPrisma(): void {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
      // Implementar busca
    }
  }

  viewPost(post: TrendingPost): void {
    console.log('Ver post:', post.id);
    // Navegar para o post
  }
}