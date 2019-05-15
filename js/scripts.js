fetch("https://en.wikipedia.org/api/rest_v1/data/lists/")
  .then(response => response.json())
  .then(data => data.lists)
  .then(lists =>
    Promise.all(lists.map(list =>
      fetch(`https://en.wikipedia.org/api/rest_v1/data/lists/${list.id}/entries/`)
        .then(response => response.json())
        .then(data => data.entries))))
  .then(allEntries =>
    _(allEntries)
      .flatten()
      .uniqBy('title')
      .orderBy([entry => new Date(entry.created)], ['desc'])
      .value())
  .then(entries =>
    entries.map(entry => {
      const AnchorNode = document.createElement('a');
      AnchorNode.setAttribute('href', '#')
      AnchorNode.addEventListener('click', () => {
        chrome.tabs.create({ active: true, url: encodeURI(`${entry.project}/wiki/${entry.title}`) });
      });
      AnchorNode.appendChild(document.createTextNode(entry.title))
      return AnchorNode;
    }))
  .then(entryNodes =>
    entryNodes.forEach(node => document.body.append(node)));