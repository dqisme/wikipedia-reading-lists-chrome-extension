export interface Entry {
  id: number,
  project: string,
  created: string,
  title: string,
}

export interface List {
  id: number,
  name: string,
}

export class EntryList {
  listId: number
  name = ''
  entries: Array<Entry> = []
  constructor(listId: number, name: string, entries: Array<Entry>) {
    this.listId = listId
    this.name = name
    this.entries = entries
  }
}