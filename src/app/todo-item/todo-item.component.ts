import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { TodoItemData } from '../classesUtils/TodoItemData';
import { TodolistService } from '../todolist.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent implements OnInit {
  @Input()
  public data!: TodoItemData;
  @ViewChild("newTextInput", { static: false })
  private inputLabel!: ElementRef;

  private _isEditing = false;
  constructor(private TDLS: TodolistService) { }

  ngOnInit() {
  }

  //Getter et Setter des paramètres des items
  get label(): string {
    return this.data.label;
  }

  set label(lab: string) {
    this.TDLS.setItemsLabel(lab, this.data);
  }

  get editionMode(): boolean {
    return this._isEditing;
  }

  set editionMode(e: boolean) {
    this._isEditing = e;
    requestAnimationFrame(() => this.inputLabel.nativeElement.focus());
  }

  get isDone(): boolean {
    return this.data.isDone;
  }

  set isDone(done: boolean) {
    this.TDLS.setItemsDone(done, this.data);
  }

  //Suppression de l'item
  destroy() {
    this.TDLS.removeItems(this.data);
  }
}
