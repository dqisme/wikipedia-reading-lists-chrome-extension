import { useState, useEffect } from "react";
import _ from 'lodash';

interface Entry {
  project: string,
  created: string,
  title: string,
}

interface List {
  id: number,
}

const useAllEntries = () => {
  const [allEntries, setAllEntries] = useState<Array<Entry>>([]);

  useEffect(() => {
    fetch("https://en.wikipedia.org/api/rest_v1/data/lists/")
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
      .then(allEntries => setAllEntries(allEntries))
  }, []);

  return allEntries;
}

export default useAllEntries;