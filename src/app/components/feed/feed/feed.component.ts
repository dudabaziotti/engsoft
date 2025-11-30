import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';

interface Post {
  isStatic: boolean,
  id?: string;
  author: {
    name: string;
    photoUrl: string;
    role?: string;
  };
  content: string;
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
  imageUrl?: string;
  liked?: boolean;
}

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {
  @Input() post: any;
  posts: Post[] = [];
  realPosts: Post[] = [];
  loading: boolean = true;
  currentUser: any = null;
  useMockData: boolean = true; // Altere para false quando quiser usar dados reais do Firestore
  auth = getAuth();
  searchTerm: string = '';
  filteredPosts: Post[] = [];

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.currentUser = getAuth().currentUser;
    if (this.useMockData) {
    this.loadMockPosts();  // carrega mock uma vez
  }

    this.subscribeToRealPosts(); // sempre por último
  }

  applyFilter() {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredPosts = [...this.posts];
      return;
    }

    const term = this.searchTerm.toLowerCase();

    if (term.startsWith('#')) {
      const clean = term.substring(1); 

      this.filteredPosts = this.posts.filter(post => 
        post.content.toLowerCase().includes('#' + clean)
      );
    } else {
      this.filteredPosts = this.posts.filter(post =>
        post.content.toLowerCase().includes(term)
      );
    }
  }


  private async loadLikesForPosts(posts: any[]) {
    const user = getAuth().currentUser;
    if (!user) return posts;

    const results = await Promise.all(
      posts.map(async post => {
        const likeDoc = await this.firestore
          .doc(`posts/${post.id}/likes/${user.uid}`)
          .ref.get();

        return {
          ...post,
          liked: likeDoc.exists
        };
      })
    );

    return results;
  }

  // Posts fictícios
  mockPosts: Post[] = [
    {
      isStatic: true,
      id: '1',
      author: {
        name: 'Maria Silva',
        photoUrl: 'assets/images/penguin.png',
        role: 'Product Designer'
      },
      content: 'Acabei de lançar meu novo projeto de design system! Foram 3 meses de trabalho intenso, mas o resultado ficou incrível. Obrigada a todos que ajudaram no processo. 🎨✨ #design',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      likesCount: 42,
      commentsCount: 8,
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      liked: false
    },
    {
      isStatic: true,
      id: '2',
      author: {
        name: 'João Santos',
        photoUrl: 'assets/images/parrot.png',
        role: 'Full Stack Developer'
      },
      content: 'Compartilhando minha jornada de aprendizado em React! Criei este tutorial completo sobre hooks que pode ajudar muita gente. O que acham? Feedback é sempre bem-vindo! 💻 #react',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
      likesCount: 87,
      commentsCount: 15,
      liked: false
    },
    {
      isStatic: true,
      id: '3',
      author: {
        name: 'Ana Costa',
        photoUrl: 'assets/images/squirrel.png',
        role: 'UX Researcher'
      },
      content: 'Insights da minha última pesquisa com usuários: 89% dos participantes preferem interfaces minimalistas. Simplicidade é a chave! 📊',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 horas atrás
      likesCount: 124,
      commentsCount: 23,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      liked: false
    },
    {
      isStatic: true,
      id: '4',
      author: {
        name: 'Pedro Oliveira',
        photoUrl: 'assets/images/flamingo.png',
        role: 'Mobile Developer'
      },
      content: 'Quem mais está animado com as novidades do Flutter 3.0? As melhorias de performance estão incríveis! 🚀',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
      likesCount: 56,
      commentsCount: 12,
      liked: false
    },
    {
      isStatic: true,
      id: '5',
      author: {
        name: 'Carla Ferreira',
        photoUrl: 'assets/images/elephant.png',
        role: 'Tech Lead'
      },
      content: 'Dicas para iniciantes em programação:\n\n1. Pratique todos os dias\n2. Leia código de outras pessoas\n3. Construa projetos reais\n4. Não tenha medo de errar\n5. Faça networking\n\nQual dica você adicionaria? 💡',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
      likesCount: 203,
      commentsCount: 45,
      liked: false
    },
    {
      isStatic: true,
      id: '6',
      author: {
        name: 'Lucas Martins',
        photoUrl: 'assets/images/fox.png',
        role: 'DevOps Engineer'
      },
      content: 'Acabei de automatizar todo nosso processo de deploy! De 2 horas para 5 minutos. A sensação é incrível! ⚡',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      likesCount: 167,
      commentsCount: 28,
      imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800',
      liked: false
    },
    {
      isStatic: true,
      id: '7',
      author: {
        name: 'Juliana Rocha',
        photoUrl: 'assets/images/rabbit.png',
        role: 'Data Scientist'
      },
      content: 'Trabalhando em um modelo de ML que prevê churn de clientes com 94% de acurácia. Machine Learning é fascinante! 🤖📈',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 dias atrás
      likesCount: 189,
      commentsCount: 31,
      liked: false
    },
    {
      isStatic: true,
      id: '8',
      author: {
        name: 'Rafael Lima',
        photoUrl: 'assets/images/whale.png',
        role: 'Frontend Developer'
      },
      content: 'Alguém mais viciado em dark mode? Não consigo mais trabalhar sem ele! 🌙',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
      likesCount: 312,
      commentsCount: 67,
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      liked: false
    }
  ];


  private subscribeToRealPosts(): void {
    this.firestore
      .collection('posts', ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges({ idField: 'id' })
      .subscribe(async (posts: any[]) => {

        let processed = posts.map(post => ({
          ...post,
          createdAt: post.createdAt?.toDate ? post.createdAt.toDate() : new Date()
        }));
        processed = await this.loadLikesForPosts(processed);

        this.realPosts = processed;
        this.composePosts();
        this.loading = false;
      });
  }

  private composePosts(): void {
  if (this.useMockData) {
    const merged = [...this.realPosts, ...this.mockPosts];

    // ordena do mais recente pro mais antigo
    merged.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return timeB - timeA; // mais novo primeiro
    });

    if (this.posts.length !== merged.length) {
      this.posts = merged;
    }

  } else {
    const onlyReal = [...this.realPosts];

    onlyReal.sort((a, b) => {
      const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return timeB - timeA;
    });

    this.posts = onlyReal;
  }
    this.filteredPosts = [...this.posts];
    this.applyFilter();
  }

  loadMockPosts(): void {
    setTimeout(() => {
      this.composePosts();
    });
  }

  onSearchChanged(value: string) {
    this.searchTerm = value;
    this.applyFilter();
  }

  loadPosts(): void {
    this.firestore
      .collection('posts', ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges({ idField: 'id' })
      .subscribe((posts: any[]) => {
        this.posts = posts.map(post => ({
          ...post,
          createdAt: post.createdAt?.toDate() || new Date(),
          liked: false
        }));
        this.loading = false;
      });
  }

  trackByPostId(index: number, post: any) {
    return post.id;
  }

  onPostCreated(): void {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}