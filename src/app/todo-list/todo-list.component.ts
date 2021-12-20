import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { State } from '../dataTypes/State';
import { TodoItemData } from '../dataTypes/TodoItemData';
import { TodoListData } from '../dataTypes/TodoListData';
import { TodolistService } from '../todolist.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  @ViewChild('searchKey', { static: false })
  searchKey!: ElementRef;
  @Input()
  public data!: TodoListData;

  private titre: string;
  public state = State;
  private filter: State = State.all;

  
  private compteurRetour: number = 0;
  private dataHistory: TodoListData[] = [];
  private bloquerHistorique: boolean = false;

  constructor(private TDLS: TodolistService) {
    this.titre = TDLS.getLabelName();
    this.chargeLocalDonnees();

    TDLS.getTodoListDataObservable().subscribe(
      tdl => {
        this.data = tdl;
        // Pour chaque changement on sauvegarde la liste locale
        this.sauvegardeLocale();
      }
    );
  }

  ngOnInit() {
  }

  appendItem(label: string, isDone = false, auto = false): void {
    if (label != "") {
      if (!auto) {
        // Réinitialisation du compteur historique 
        this.compteurRetour = 0;
      }
      this.TDLS.appendItems(
        {
          label, isDone
        });
    }
  }

  setItemDone(item: TodoItemData, done: boolean): void {
    this.TDLS.setItemsDone(done, item);
  }

  itemLabel(item: TodoItemData, label: string): void {
    this.TDLS.setItemsLabel(label, item);
  }

  removeItem(item: TodoItemData): void {
    this.TDLS.removeItems(item);
  }

  get label(): string {
    return this.data.label;
  }

  get items(): TodoItemData[] {
    return this.data.items;
  }

  isAllDone(): boolean {
    return this.items.every(it => it.isDone);
  }

  toggleAllDone() {
    const done = !this.isAllDone();
    this.TDLS.setItemsDone(done, ...this.items);
  }

  compteurItems(): number {
    return (this.items.length - this.items.filter(item => item.isDone).length);
  }

  setFiltre(value: any) {
    this.filter = value;
  }
  
  estItemAffiche(item: { isDone: boolean; }) {
    if ((this.filter === State.all) ||
      (this.filter === State.actived && !item.isDone) ||
      (this.filter === State.completed && item.isDone)) {
      return true;
    }
    return false;
  }

  checkState(state: State) {
    if (state == this.filter) {
      return true;
    }
    return false;
  }

  isItemCoches(): boolean {
    return this.items.filter(x => x.isDone).length > 0;
  }

  supprimeItemCoches() {
    // On récupère la liste des items cochés et on boucle dans un foreach pour supprimer chaque item
    this.items.filter(x => x.isDone).forEach(item => {
      this.removeItem(item);
    });
  }

  supprimeTousItems() {
    // On récupère la liste des items et on boucle dans un foreach pour supprimer chaque item
    this.items.forEach(item => {
      this.removeItem(item);
    });
  }

  isAnnuler() {
    return this.dataHistory.length > this.compteurRetour + 1;
  }

  isRefaire() {
    return this.compteurRetour > 0;
  }

  annulerRefaireItems(isAnnuler: boolean) {
    this.bloquerHistorique = true;
    this.compteurRetour = isAnnuler ? this.compteurRetour + 1 : this.compteurRetour - 1;
    var dataModifie = this.dataHistory[this.dataHistory.length - 1 - this.compteurRetour];
    this.supprimeTousItems();
    this.appendItemsByData(dataModifie.items);
    this.bloquerHistorique = false;
  }

  sauvegardeLocale() {
    localStorage.setItem(this.label, JSON.stringify(this.items));
    // On ne sauvegarde pas si on est dans un "refaire" ou "annuler" 
    if (!this.bloquerHistorique) {
      this.dataHistory.push(this.data);
    }
  }

  remiseAZeroHistorique() {
    this.dataHistory = [];
    this.sauvegardeLocale();
    this.compteurRetour = 0;
  }

  chargeLocalDonnees() {
    this.appendItemsByData(JSON.parse(localStorage.getItem(this.titre)!));
  }

  supprimerLocalStorage() {
    localStorage.removeItem(this.titre);
  }

  appendItemsByData(datas: TodoItemData[]): void {
    if (datas != null && datas.length > 0) {
      datas.forEach(x => this.appendItem(x.label, x.isDone, true));
    }
  }





/*
  get obsTodoList(): Observable<TodoList> {
    return this.TDLS.observable;
  }
  
  append(label: string, champ: any): void {
    this.TDLS.append(label);
    champ.champTexte = "";
  }
  updateItem(item: TodoItem, u: Partial<TodoItem>): void {
    this.TDLS.update(u, item);
  }

  delete(item: TodoItem): void {
    this.TDLS.remove(item);
  }
*/
}

