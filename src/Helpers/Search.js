export const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  
    const { searchKey, results} = prevState
  
      console.log(`Setting search top stories`)
  
      // Consider `const pageNumber = (results && results.page) || 0`. This means, if results and results.page is not null (or falsey),
      // then use the results.page value (the latter of the two), if either are null, use 0. Hence, the below expression means if
      // results and results[searchKey] is not null, use the hits stored under this key. If they are null, use an empty array. 
      // && statements have precendence over other operators, hence bracketing the && statement or not makes no difference. 
      const oldHits = (results && results[searchKey]) ? results[searchKey].hits : []
  
      const updatedHits = [...oldHits, ...hits]
  
      console.log(`Number of hits when setting top stories state: ${updatedHits.length}, pageNo.: ${page}`)
  
      return (
        {
          results: {
            ...results, [searchKey] : {hits: updatedHits, page}
          },
          isLoading: false
        }
      )
  }
  