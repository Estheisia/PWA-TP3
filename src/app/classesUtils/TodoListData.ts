import {TodoItemData} from './TodoItemData';
//Deux éléments pour une liste d'item : Une string et un tableau d'ItemData
export interface TodoListData {
  label: string;
  items: TodoItemData[];
}
