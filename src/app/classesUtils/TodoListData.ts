import {TodoItemData} from './TodoItemData';
//Deux éléments : Une string et un tableau d'ItemData
export interface TodoListData {
  label: string;
  items: TodoItemData[];
}
