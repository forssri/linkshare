import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Item } from './models/Item';
import { User } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  links: Observable<any[]>;
  linksCollection: AngularFirestoreCollection<Item>;
  link: string;
  linkForm: FormGroup;
  user$: Observable<firebase.User>;
  currentUser: User;
  constructor(private af: AngularFirestore, private fb: FormBuilder, public afAuth: AngularFireAuth) {
    this.linksCollection = af.collection<Item>('links');
    this.links = this.linksCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Item;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
    this.user$ = this.afAuth.authState.pipe(
      tap(user => {
        this.currentUser = { displayName: user.displayName, email: user.email, photoURL: user.photoURL, uid: user.uid };
        console.log(this.currentUser);
      })
    );
    this.initForm();
  }

  initForm(): void {
    this.linkForm = this.fb.group({
      linkUrl: ['', Validators.required]
    });
  }

  addLink(): void {
    if (this.linkForm.value && this.linkForm.value.linkUrl !== '') {
      this.af.collection<Item>('links').add({ url: this.linkForm.value.linkUrl, createdBy: this.currentUser }).then(() => {
        this.reset();
      });
    }
  }

  updateLink(item): void {
    this.linksCollection.doc(item.id).update({ ...item, done: true });
  }

  reset(): void {
    this.linkForm.reset();
  }

  login(): void {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): void {
    this.afAuth.signOut();
  }
}
