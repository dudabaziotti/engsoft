import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  likes: number;
  tag?: string;
}

@Component({
  selector: 'app-rigthbar',
  templateUrl: './rigthbar.component.html',
  styleUrls: ['./rigthbar.component.scss']
})
export class RigthbarComponent implements OnInit {
  searchQuery: string = '';
  @Output() searchChanged = new EventEmitter<string>();

  onSearch(event: any) {
    this.searchChanged.emit(event.target.value);
  }
  
  relevantPeople: RelevantPerson[] = [
    {
      id: '1',
      name: 'Eduarda Baziotti',
      photoUrl: 'assets/images/gato.png',
      role: 'Engenharia - Front-End Developer',
      following: false
    },
    {
      id: '2',
      name: 'Iris Dias Pires',
      photoUrl: 'assets/images/alpaca.png',
      role: 'Engenharia - Layout de PCB',
      following: false
    },
    {
      id: '3',
      name: 'Juninho Baziotti',
      photoUrl: 'assets/images/ra.png',
      role: 'Engenharia - Controle e Automação',
      following: false
    }
  ];

  trendingPosts: TrendingPost[] = [
    {
      id: '1',
      author: 'Laura Vieira',
      time: '2 dias atrás',
      preview: 'This was the peak of electronics. This was also my family\'s first touch screen mobile.',
      likes: 443,
      tag: '#aviacao'
    },
    {
      id: '2',
      author: 'Pedro Klauss',
      time: '22h ago',
      preview: 'Added a link to my collection - Weekly shelf',
      likes: 320,
      tag: '#quimica'
    },
        {
      id: '3',
      author: 'Livia Mendes',
      time: '5 dias atrás',
      preview: 'Added a link to my collection - Weekly shelf',
      likes: 289,
      tag: '#biologia'
    },
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