// Number of icons to process at once. Processing can be canceld between two bunches of icons
const ICONS_TO_PROCESS = 100
// Request id is used to stop processing if a new request has been received
let _requestId = 0

/** Web worker entry point */
onmessage = function (e) {
  _requestId++
  postClear()
  search(e.data.iconList, e.data.synonyms, e.data.query, _requestId)
}

/** Post a message to the web worker consumer to clear the results */
const postClear = result => {
  postMessage({ type: 'clear' })
}

/** Post a message to the web worker consumer to add results to the one previously sent */
const postAdd = result => {
  postMessage({ type: 'add', payload: result })
}

/** Search for icons matching the query */
const search = (iconList, synonyms, query, requestId, startIndex = 0) => {
  // Cancel search if request id has changed
  if (requestId !== _requestId) {
    return
  }

  // If the query has an exact match in the list of synonyms, search for this synonyms too.
  // For instance, query 'sport' will also match football, baseball, hockey...
  const syn = synonyms[query]
  const result = []

  for (
    let k = startIndex;
    k < iconList.length && k < startIndex + ICONS_TO_PROCESS;
    k++
  ) {
    const item = processIcon(iconList[k], syn, query, requestId)
    if (item) {
      result.push(item)
    }
  }

  // Post result if any
  if (result && result.length > 0) {
    // Do not post the result if request id has changed during processing
    setTimeout(() => {
      if (requestId !== _requestId) {
        return
      }
      postAdd(result)
    }, 10)
  }

  // Process another bunch of icons
  if (startIndex + ICONS_TO_PROCESS < iconList.length) {
    setTimeout(() => {
      search(
        iconList,
        synonyms,
        query,
        requestId,
        startIndex + ICONS_TO_PROCESS
      )
    }, 10)
  }
}

/** Check if the specified item is a match for the query and return an object that will be used for display */
const processIcon = (icon, syn, query) => {
  if (isMatch(icon, syn, query)) {
    return {
      src: 'svg/' + icon.svg,
      title: icon.svg + ' - ' + icon.name
    }
  }
}

/** Check if the specified item is a match for the query */
const isMatch = (iconItem, synonyms, query) => {
  const words = iconItem.name.split(' ')
  // query is in name
  if (words.indexOf(query) > -1) return true
  if (synonyms) {
    let found = false
    words.forEach(word => {
      // one of the synonym of the query is in name
      if (synonyms.indexOf(word) > -1) {
        found = true
      }
    })
    if (found) return true
  }
  return false
}
