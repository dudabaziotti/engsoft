import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RecuperarSenhaComponent } from './components/recuperar-senha/recuperar-senha.component';
import { NewPostComponent } from './components/feed/new-post/new-post.component';
import { RigthbarComponent } from './components/rigthbar/rigthbar.component';
import { CommentsComponent } from './components/comments/comments.component';
import { FeedComponent } from './components/feed/feed/feed.component';
import { FeedCardComponent } from './components/feed/feed-card/feed-card.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { PerfilComponent } from './components/perfil/perfil.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    RecuperarSenhaComponent,
    FeedComponent,
    FeedCardComponent,
    NewPostComponent,
    SideBarComponent,
    RigthbarComponent,
    CommentsComponent,
    PerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
