import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { DashboardService, Item } from '../services/dashboard.service';
import { TranslateService } from '@ngx-translate/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('dashboardTasks') dashboardTasksRef;
  tasks: any;
  dashboardTasks: any;
  dashboardTasksFiltered: any;
  filterText: string;
  dashboardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private translate: TranslateService,
    public dashboardSrvc: DashboardService
  ) {
    this.auth.authState.subscribe(usr => {
      if (usr) {
        this.afs.doc<Item>(`user/${usr.uid}`).collection('tasks', ref => ref.orderBy('index'))
        .snapshotChanges()
        .pipe(
          map((actions: any) => actions.map(act => {
            const data = act.payload.doc.data();
            const id = act.payload.doc.id;
            return { id, ...data };
          }))
        ).subscribe(result => {
          this.tasks = result;
          this.filterBlurred();
        });
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.dashboardForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        filter: ['']
    });
  }

  isValidInput(fieldName): boolean {
    return this.dashboardForm.controls[fieldName].invalid &&
      (this.dashboardForm.controls[fieldName].dirty || this.dashboardForm.controls[fieldName].touched);
  }

  addItem() {
    this.dashboardSrvc.createItem({
      name: this.dashboardForm.get('name').value,
      description: this.dashboardForm.get('description').value,
      index: this.dashboardTasksRef.nativeElement.children.length
    });
    this.dashboardForm.get('name').setValue('');
    this.dashboardForm.get('description').setValue('');
    this.dashboardForm.get('name').setErrors(undefined);
    this.dashboardForm.get('description').setErrors(undefined);
    this.dashboardTasksFiltered = this.dashboardTasks.map(item => item);
    this.dashboardTasks = undefined;
  }

  filterBlurred() {
    if (this.dashboardForm.get('filter').value) {
      if (!this.dashboardTasks) {
        this.dashboardTasks = this.tasks.map(item => item);
      }
      this.dashboardTasksFiltered = this.dashboardTasks.filter(task => {
        return task.name.indexOf(this.dashboardForm.get('filter').value) !== -1;
      });
      this.tasks = this.dashboardTasksFiltered;
    } else if (this.dashboardTasks) {
      this.tasks = this.dashboardTasks;
    }
  }

  deleteTask(task) {
    this.dashboardSrvc.deleteItem(task);
    this.dashboardForm.get('filter').setValue('');
  }

  updateTask(event, task) {
    task.done = !task.done;
    this.dashboardSrvc.updateItem(task);
  }

  getLangFromStorage() {
    return localStorage.getItem('lang');
  }

  drop(event: CdkDragDrop<string[]>, arr) {
    if (event.previousContainer === event.container) {
      moveItemInArray(arr, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(arr,
        arr,
        event.previousIndex,
        event.currentIndex);
    }

    this.dashboardSrvc.updateBatch(arr);
  }
}
