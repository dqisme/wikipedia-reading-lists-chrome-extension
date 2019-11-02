import { useState, useEffect } from 'react'
import _ from 'lodash'
import { List, Entry, EntryList } from '../types'
import { DATA_KEY } from '../config'

const getEntryLists = () => JSON.parse(localStorage.getItem(DATA_KEY) || '[]')
const saveEntryLists = (allEntries: Array<EntryList>) => localStorage.setItem(DATA_KEY, JSON.stringify(allEntries))
const clearEntryLists = () => localStorage.removeItem(DATA_KEY)

const useEntries = (filterText: String) => {
  const [allEntryLists, setEntryLists] = useState<Array<EntryList>>(getEntryLists())
  const [isFetching, setIsFetching] = useState<boolean>(false)

  useEffect(() => {
    setIsFetching(true)
    fetch('https://en.wikipedia.org/api/rest_v1/data/lists/')
      .then(response => response.json())
      .then(data => data.lists as Array<List>)
      .then(lists =>
        Promise.all(lists.map(list =>
          fetch(`https://en.wikipedia.org/api/rest_v1/data/lists/${list.id}/entries/`)
            .then(response => response.json())
            .then(data => new EntryList(list.name, data.entries)))))
      .then(entryLists => {
        saveEntryLists(entryLists)
        setEntryLists(entryLists)
      })
      .catch(() => {
        clearEntryLists()
      })
      .finally(() => setIsFetching(false))
  }, [])

  const shouldFiltered = (entry: Entry) => entry.title.toLowerCase().includes(filterText.toLowerCase());

  return {
    entries: _.map(allEntryLists, list =>
      new EntryList(list.name, _.filter(list.entries, shouldFiltered))),
    isFetching,
  }
}

export default useEntries;