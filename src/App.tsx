import React, { useState, useEffect } from 'react';
import _ from 'lodash';

interface Entry {
  project: string,
  created: string,
  title: string,
}

interface List {
  id: number,
}

const App: React.FC = () => {
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
  return (
    <div>
      {allEntries.map(entry => (
        <a key={entry.title} href="#" onClick={() => window.chrome.tabs.create({ active: true, url: encodeURI(`${entry.project}/wiki/${entry.title}`) })}>
          {entry.title}
        </a>
      ))}
    </div>
  );
}

export default App;
