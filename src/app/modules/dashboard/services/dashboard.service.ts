import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  items: any = [];
  userId: string;
  userDoc;
  tasks$;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
  ) {
    this.auth.authState.subscribe(usr => {
      if (usr) {
        this.userId = usr.uid;
        this.userDoc = this.afs.doc<Item>(`user/${this.userId}`);
        this.tasks$ = this.userDoc.collection('tasks', ref => ref.orderBy('index'))
        .snapshotChanges()
        .pipe(
          map((actions: any) => actions.map(act => {
            const data = act.payload.doc.data();
            const id = act.payload.doc.id;
            return { id, ...data };
          }))
        );
      }
    });
  }

  createItem(item) {
    this.userDoc.collection('tasks').add(item);
  }

  deleteItem(item) {
    this.userDoc.collection('tasks').doc(item.id).delete();
  }

  updateItem(item) {
    this.userDoc.collection('tasks').doc(item.id).update(item);
  }

  updateBatch(data: any) {
    const copyData = data.map((d, i) => {
      d.index = i;
      return d;
    });
    this.userDoc.collection('tasks').ref.get().then(res => {
      const batch = this.afs.firestore.batch();
      res.docs.forEach(item => {
        batch.update(item.ref, {
          index: copyData.find(d => d.id === item.id).index
        });
      });
      batch.commit().catch(err => console.error(err));
    });
  }
}

export class Item {
  name: string;
  description: string;
}
