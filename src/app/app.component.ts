import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoItem, TodoList, TodolistService } from './todolist.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor(private TDLS: TodolistService) { }
  /*
  get obsTodoList(): Observable<TodoList> {
    return this.TDLS.observable;
  }
  
  append(label: string): void {
    this.TDLS.append(label);
  }
  updateItem(item: TodoItem, u: Partial<TodoItem>): void {
    this.TDLS.update(u, item);
  }

  delete(item: TodoItem): void {
    this.TDLS.remove(item);
  }
  */
}
