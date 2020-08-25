class AddEntryService {

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
      if (!url.origin.includes("en.wikipedia.org")) return reject("invalid url")
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

  private static postToList = (url: URL, origin: string, listId: number, token: string, title: string): Promise<number | undefined> => {
    console.log('-------- begin post --------')
    console.log('post url', url)
    console.log('post origin', origin)
    console.log('post listId', listId)
    console.log('post title', title)

    const postUrlString = `${origin}/api/rest_v1/data/lists/${listId}/entries/?csrf_token=${encodeURIComponent(token)}`
    const postHeaders: RequestInit = {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      credentials: 'same-origin',
      body: `project=${AddEntryService.mobileToCanonicalHost(url).origin}&title=${title}`
    }
    console.log('postUrlString', postUrlString)
    console.log('postHeaders', postHeaders)

    return fetch(postUrlString, postHeaders)
      .then(res => res.json())
      .then(body => body.id)
  }

  /**
   * Add an entry (article) to a list by listId
   * @param listId number: list id
   * @returns Promise<void>
   */
  public static addEntryToList = async (listId: number) => {
    try {
      const [tab, urlString]: [chrome.tabs.Tab, string] = await AddEntryService.getTab()
      console.log('tab', tab)
      console.log('urlString', urlString)

      const url: URL = new URL(urlString)
      await AddEntryService.validateOrigin(url)

      const token: string = await AddEntryService.getCsrfToken(url.origin)
      console.log('token', token)

      const title: string = await AddEntryService.getCanonicalPageTitle(tab)
      console.log('title', title)

      const listEntryId: number | undefined = await AddEntryService.postToList(url, url.origin, listId, token, title)
      console.log('listEntryId', listEntryId)
      if (listEntryId) {
        // success if there is an id
        console.log(`success id:${listEntryId}`)
      } else {
        // failed
        console.log(`failed id:${listEntryId}`)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

export default AddEntryService