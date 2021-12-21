import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { State } from '../classesUtils/State';
import { TodoItemData } from '../classesUtils/TodoItemData';
import { TodoListData } from '../classesUtils/TodoListData';
import { TodolistService } from '../todolist.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  @Input()
  public data!: TodoListData;

  //Variables
  private titre: string;
  //Utilisisation d'un énumérable pour l'état, All par défaut
  public state = State;
  private filter: State = State.all;
  
  //Gestion de l'historique
  private redoCount: number = 0;
  private dataHistory: TodoListData[] = [];
  private isHistoryBlocked: boolean = false;

  constructor(private TDLS: TodolistService) {
    //Récupération du label de localstorage
    this.titre = TDLS.getLabelName();
    //Chargement des données
    this.chargeLocalDonnees();

    TDLS.getTodoListDataObservable().subscribe(
      tdl => {
        this.data = tdl;
        //On sauvegarde la liste à chaque changement
        this.sauvegardeLocale();
      }
    );
  }

  ngOnInit() {
  }

  //Getter et Setter des paramètres de la liste
  get label(): string {
    return this.data.label;
  }

  get items(): TodoItemData[] {
    return this.data.items;
  }

  setFiltre(value: any) {
    this.filter = value;
  }

  setItemDone(item: TodoItemData, done: boolean): void {
    this.TDLS.setItemsDone(done, item);
  }

  itemLabel(item: TodoItemData, label: string): void {
    this.TDLS.setItemsLabel(label, item);
  }

  //Ajoute un item dans la liste
  appendItem(label: string, isDone = false, auto = false): void {
    if (label != "") {
      if (!auto) {
        //Réinitialisation du compteur de l'historique 
        this.redoCount = 0;
      }
      //Ajout de l'item à la liste
      this.TDLS.appendItems(
        {
          label, isDone
        });
    }
  }

  //Supprime un item
  removeItem(item: TodoItemData): void {
    this.TDLS.removeItems(item);
  }

  //Renvoie le nombre d'items
  compteurItems(): number {
    return (this.items.length - this.items.filter(item => item.isDone).length);
  }

  //Renvoie un booléen suivant si tous les items sont cochés
  isAllDone(): boolean {
    return this.items.every(it => it.isDone);
  }

  //Coche tous les items
  toggleAllDone() {
    const done = !this.isAllDone();
    this.TDLS.setItemsDone(done, ...this.items);
  }
  
  //Vérifie un item est affiché
  estItemAffiche(item: { isDone: boolean; }) {
    if ((this.filter === State.all) ||
      (this.filter === State.todo && !item.isDone) ||
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
    //On récupère la liste des items cochés et on boucle dans un foreach pour supprimer chaque item
    this.items.filter(x => x.isDone).forEach(item => {
      this.removeItem(item);
    });
  }

  supprimeTousItems() {
    //On récupère la liste des items et on boucle dans un foreach pour supprimer chaque item
    this.items.forEach(item => {
      this.removeItem(item);
    });
  }

  //Vérifie si on peut logiquement annuler ou refaire
  isAnnuler() {
    return this.dataHistory.length > this.redoCount + 1;
  }
  isRefaire() {
    return this.redoCount > 0;
  }

  annulerRefaireItems(isAnnuler: boolean) {
    this.isHistoryBlocked = true;
    this.redoCount = isAnnuler ? this.redoCount + 1 : this.redoCount - 1;
    var dataModifie = this.dataHistory[this.dataHistory.length - 1 - this.redoCount];
    this.supprimeTousItems();
    this.appendItemsByData(dataModifie.items);
    this.isHistoryBlocked = false;
  }

  sauvegardeLocale() {
    localStorage.setItem(this.label, JSON.stringify(this.items));
    //On ne sauvegarde pas si on undo / redo 
    if (!this.isHistoryBlocked) {
      this.dataHistory.push(this.data);
    }
  }

  remiseAZeroHistorique() {
    this.dataHistory = [];
    this.sauvegardeLocale();
    this.redoCount = 0;
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
}

