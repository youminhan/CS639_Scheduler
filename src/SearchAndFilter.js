class SearchAndFilter {
  searchAndFilter(courses, allTags, searchMode) {
    return searchMode === "Fit all the tags" ? 
      Object.fromEntries(Object.entries(courses).filter(([key,course]) => {
        return allTags.every(tag => {
          return course['keywords'].includes(tag)
        })
      })) :
      Object.fromEntries(Object.entries(courses).filter(([key,course]) => {
        return allTags.length === 0 ? courses : course['keywords'].some(tag => {
          return allTags.includes(tag)
        })
      }));
  }
}

export default SearchAndFilter;
