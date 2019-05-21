import React from 'react';
import useAllEntries from './hooks/useAllEntries';

const App: React.FC = () => {
  const allEntries = useAllEntries();
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
