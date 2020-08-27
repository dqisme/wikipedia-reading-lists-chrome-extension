class EntryService {

  /**
   * Get tab object and tab url
   */
  private static getTab = (): Promise<[chrome.tabs.Tab, string]> => {
    return new Promise((resolve, reject) => {
      window.chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] === undefined) return reject("undefined tab")
        if (tabs[0].url === undefined) return reject("undefined url")
        resolve([tabs[0], tabs[0].url])
      })
    })
  }

  /**
   * Validate if url has wikipedia 
   * @param url URL
   */
  private static validateOrigin = (url: URL): Promise<URL> => {
    return new Promise((resolve, reject) => {
      if (!url.origin.includes("wikipedia.org") && !url.origin.includes("wikivoyage.org")) return reject("invalid url")
      resolve(url)
    })
  }

  /**
   * Get CSRF token for the account
   * @param origin string: URL's origin
   * @returns Promise string of token
   */
  private static getCsrfToken = (origin: string): Promise<string> => {
    return fetch(`${origin}/w/api.php?action=query&format=json&formatversion=2&meta=tokens&type=csrf`, { credentials: 'same-origin' })
      .then(res => res.json())
      .then(res => res.query.tokens.csrftoken)
  }

  /**
   * Get wikipedia page title from URL
   * @param tab Tab
   */
  private static getCanonicalPageTitle = (tab: chrome.tabs.Tab): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (tab.id === undefined || tab.url === undefined) return reject("undefined tab id || tab url")

      console.log('tab.id', tab.id)
      // window.chrome.tabs.sendMessage(tab.id, { type: 'wikiExtensionGetPageTitle' }, (res) => {
      //   console.log('response tab sendMessage', res)

      //   const url = new URL(res.href)
      //   resolve(String(url.searchParams.has('title') ? url.searchParams.get('title') : url.pathname.replace('/wiki/', '')))
      // })
      const url = new URL(tab.url)
      resolve(String(url.searchParams.has('title') ? url.searchParams.get('title') : url.pathname.replace('/wiki/', '')))
    })
  }

  private static mobileToCanonicalHost = (url: URL): URL => {
    url.hostname = url.hostname.replace(/^m\./, '').replace('.m.', '.');
    return url;
  }

  /**
   * POST - Add an entry (article) to list
   */
  private static postToList = (url: URL, origin: string, listId: number, token: string, title: string): Promise<number | undefined> => {
    console.log('--- begin post ---')
    console.log('post url', url)
    console.log('post origin', origin)
    console.log('post listId', listId)
    console.log('post title', title)

    const urlString = `${origin}/api/rest_v1/data/lists/${listId}/entries/?csrf_token=${encodeURIComponent(token)}`
    const details: RequestInit = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      credentials: 'same-origin',
      body: `project=${EntryService.mobileToCanonicalHost(url).origin}&title=${title}`
    }
    console.log('post urlString', urlString)
    console.log('post details', details)

    return fetch(urlString, details)
      .then(res => {
        console.log('post response', res)
        return res.json()
      })
      .then(body => {
        console.log('post response body', body)
        return body.id
      })
  }

  /**
   * Add an entry (article) to a list by listId
   * @param listId number: list id
   * @returns Promise<void>
   */
  public static addEntryToList = async (listId: number, listName: string): Promise<string> => {
    try {
      const [tab, urlString]: [chrome.tabs.Tab, string] = await EntryService.getTab()
      console.log('tab', tab)
      console.log('urlString', urlString)

      const url: URL = new URL(urlString)
      await EntryService.validateOrigin(url)

      const token: string = await EntryService.getCsrfToken(url.origin)
      console.log('token', token)

      const title: string = await EntryService.getCanonicalPageTitle(tab)
      console.log('title', title)

      const listEntryId: number | undefined = await EntryService.postToList(url, url.origin, listId, token, title)
      console.log('listEntryId', listEntryId)
      if (listEntryId) {
        // success if there is an id
        console.log(`success id:${listEntryId}`)
        return Promise.resolve(`✅Added ${title} to ${listName}!`)
      } else {
        // failed
        console.log(`failed id:${listEntryId}`)
        return Promise.resolve(`❌Failed! Tried to add ${title} to ${listName}!`)
      }
    } catch (err) {
      // unexpected error from Promise above
      console.error(err)
      return Promise.resolve(`❌Failed! Unexpected error when adding`)
    }
  }

  /**
   * DELETE - remove the entry from the list
   */
  private static deleteFromList = (origin: string, listId: number, token: string, entryId: number): Promise<boolean> => {
    console.log("--- begin delete ---")
    console.log('delete origin', origin)
    console.log('delete listId', listId)
    console.log('delete entryId', entryId)

    const urlString = `${origin}/api/rest_v1/data/lists/${listId}/entries/${entryId}?csrf_token=${encodeURIComponent(token)}`
    const details: RequestInit = {
      method: 'DELETE',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      credentials: 'same-origin'
    }
    console.log('delete urlString', urlString)
    console.log('delete details', details)

    return fetch(urlString, details)
      .then((res) => {
        console.log('delete response', res)
        console.log('delete isBodyUse?', res.bodyUsed)
        return res.bodyUsed
      })
  }

  /**
   * Delete an entry (article) from list
   * @param listId list id
   * @param entryId entry id
   * @param entryName entry name
   */
  public static deleteEntryFromList = async (listId: number, entryId: number, entryName: string): Promise<string> => {
    try {
      // const [tab, urlString]: [chrome.tabs.Tab, string] = await EntryService.getTab()
      // console.log('tab', tab)
      // console.log('urlString', urlString)


      // TODO: not sure if this is the best way
      const url: URL = new URL('https://en.wikipedia.org')
      const token: string = await EntryService.getCsrfToken(url.origin)
      console.log('token', token)

      const isBodyUsed: boolean = await EntryService.deleteFromList(url.origin, listId, token, entryId)
      if (!isBodyUsed) {
        // success if response body is not used
        console.log(`success isBodyUsed:${isBodyUsed}`)
        return Promise.resolve(`✅Deleted ${entryName}!`)
      } else {
        // failed
        console.log(`failed isBodyUsed:${isBodyUsed}`)
        return Promise.resolve(`❌Failed! Tried to delete ${entryName}!`)
      }
    } catch (err) {
      // unexpected error from Promise above
      console.error(err)
      return Promise.resolve(`❌Failed! Unexpected error when deleting`)
    }
  }

  /**
   * POST - add a new list
   */
  private static postNewList = (origin: string, name: string, token: string): Promise<number | undefined> => {
    console.log("--- begin post ---")
    console.log('post origin', origin)
    console.log('post name', name)
    console.log('post token', token)

    const urlString = `${origin}/api/rest_v1/data/lists/?csrf_token=${encodeURIComponent(token)}`
    const details: RequestInit = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ name: name, description: "" })
    }
    console.log('post urlString', urlString)
    console.log('post details', details)

    return fetch(urlString, details)
      .then(res => {
        console.log('post response', res)
        return res.json()
      })
      .then(body => {
        console.log('post response body', body)
        return body.id
      })
  }

  /**
   * Add a new list
   * @param name: string - list name
   */
  public static addNewList = async (name: string): Promise<string> => {
    try {
      // TODO: not sure if this is the best way
      const url: URL = new URL('https://en.wikipedia.org')
      const token: string = await EntryService.getCsrfToken(url.origin)

      const listId: number | undefined = await EntryService.postNewList(url.origin, name, token)
      console.log('listId', listId)
      if (listId) {
        // success if there is an id
        console.log(`success id:${listId}`)
        return Promise.resolve(`✅Created ${name}!`)
      } else {
        // failed
        console.log(`failed id:${listId}`)
        return Promise.resolve(`❌Failed! Tried to ${name}!`)
      }
    } catch (err) {
      // unexpected error from Promise above
      console.error(err)
      return Promise.resolve(`❌Failed! Unexpected error when adding`)
    }
  }

  /**
   * DELETE - delete a list
   */
  private static deleteList = (origin: string, listId: number, token: string): Promise<boolean> => {
    console.log("--- begin delete ---")
    console.log('delete origin', origin)
    console.log('delete listId', listId)
    console.log('delete token', token)

    const urlString = `${origin}/api/rest_v1/data/lists/${listId}?csrf_token=${encodeURIComponent(token)}`
    const details: RequestInit = {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      credentials: 'same-origin',
    }
    console.log('post urlString', urlString)
    console.log('post details', details)

    return fetch(urlString, details)
      .then(res => {
        console.log('delete response', res)
        console.log('delete isBodyUse?', res.bodyUsed)

        // can not delete default list
        if (res.status !== 200) return true

        // success if false (no body is used)
        return res.bodyUsed
      })
  }

  /**
   * Delete a list
   * @param listId: number - list id
   * @param listName: string - list name
   */
  public static deleteThisList = async (listId: number, listName: string) => {
    try {
      // TODO: not sure if this is the best way
      const url: URL = new URL('https://en.wikipedia.org')
      const token: string = await EntryService.getCsrfToken(url.origin)

      const isBodyUsed: boolean = await EntryService.deleteList(url.origin, listId, token)
      if (!isBodyUsed) {
        // success if response body is not used
        console.log(`success isBodyUsed:${isBodyUsed}`)
        return Promise.resolve(`✅Deleted list ${listName}!`)
      } else {
        // failed
        console.log(`failed isBodyUsed:${isBodyUsed}`)
        return Promise.resolve(`❌Failed! Tried to delete list ${listName}!`)
      }
    } catch (err) {
      console.error(err)
      return Promise.resolve(`❌Failed! Unexpected error when adding`)
    }
  }
}

export default EntryService