import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  links: Observable<any[]>;
  link: string;
  constructor(private af: AngularFirestore) {
    this.links = af.collection('links').valueChanges();
  }

  addLink(): void {
    if (this.link && this.link !== '') {
      this.af.collection('links').add({ url: this.link }).then(() => {
        this.reset();
      });
    }
  }

  reset(): void {
    this.link = '';
  }
}
