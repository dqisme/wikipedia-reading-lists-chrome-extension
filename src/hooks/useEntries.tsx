import { useState, useEffect } from 'react';
import _ from 'lodash';

interface Entry {
  project: string,
  created: string,
  title: string,
}

interface List {
  id: number,
}

const getAllEntries = () => JSON.parse(localStorage.getItem('allEntries') || '[]');
const saveAllEntries = (allEntries: Array<Entry>) => localStorage.setItem('allEntries', JSON.stringify(allEntries))

const useEntries = (filterText: String) => {
  const [allEntries, setAllEntries] = useState<Array<Entry>>(getAllEntries());
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    setIsFetching(true);
    fetch('https://en.wikipedia.org/api/rest_v1/data/lists/')
      .then(response => response.json())
      .then(data => data.lists as Array<List>)
      .then(lists =>
        Promise.all(lists.map(list =>
          fetch(`https://en.wikipedia.org/api/rest_v1/data/lists/${list.id}/entries/`)
            .then(response => response.json())
            .then(data => data.entries as Array<Entry>))))
      .then(allEntries =>
        _(allEntries)
          .flatten()
          .uniqBy('title')
          .orderBy([entry => new Date(entry.created)], ['desc'])
          .value())
      .then(allEntries => {
        saveAllEntries(allEntries);
        setAllEntries(allEntries); })
      .finally(() => setIsFetching(false))
  }, []);

  return {
    entries: allEntries.filter(entry =>
      entry.title.toLowerCase().includes(filterText.toLowerCase())),
    isFetching,
  };
}

export default useEntries;