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
  name = ''
  entries: Array<Entry> = []
  constructor(name: string, entries: Array<Entry>) {
    this.name = name
    this.entries = entries
  }
}