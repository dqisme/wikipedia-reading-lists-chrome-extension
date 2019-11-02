import React, { useState } from 'react';
import useEntries from './hooks/useEntries';

import NetworkIndicator from './components/NetworkIndicator';
import SearchBar from './components/SearchBar';
import List from './components/EntryList';

const App: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { entries, isFetching } = useEntries(searchText);
  return (
    <>
      <NetworkIndicator isFetching={isFetching} />
      <SearchBar onChange={setSearchText} />
      <List data={entries} loading={isFetching} listMode={false} />
    </>
  );
}

export default App;
