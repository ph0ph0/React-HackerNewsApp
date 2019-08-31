import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import {
    DEFAULT_QUERY,
   DEFAULT_HITSPERPAGE,
   PATH_BASE,
   PATH_SEARCH,
   PARAM_SEARCH,
   PARAM_PAGE,
   PARAM_HITSPERPAGE
  } from './Constants/Constants.js'
import {updateSearchTopStoriesState} from './Helpers/Search.js'
import {
  Button
} from './Components/Buttons.jsx'
import { Table } from './Components/Table.jsx'
import { withLoading } from './HOCs/withLoading.jsx'
import { ContentManager } from './Components/ContentManager.jsx'
import { Search } from './Components/Search.jsx'
import { TextHeader } from './Components/TextHeader.jsx'
import { CharacterCounterTextArea } from './Components/CharacterCounterTextArea.jsx'

// HOCs
const ButtonWithLoading = withLoading(Button)

class App extends Component {

  _isMounted = false

  constructor(props) {
    super(props) 
    this.state = {
      results: null,
      page: 0,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    }
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this)
    this.searchTopStories = this.searchTopStories.bind(this)
    this.onDismiss = this.onDismiss.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
  }

  needsToSearchTopStories(searchTerm) {

    if (!this.state.results[searchTerm]) {
      console.log(`Search term isn't cached, will search API now`)
    } else {
      console.log(`Search term is cached, will retrieve from cache`)
    }

    return !this.state.results[searchTerm]
  }

  setSearchTopStories(json) {

    const { hits, page } = json

    this.setState(updateSearchTopStoriesState(hits, page))
  }

  onSearchChange = e => {
    this.setState({ searchTerm: e.target.value });
  };


  onSearchSubmit(event) {
    const { searchTerm } = this.state

    // When the state.searchKey changes, the Table is re-rendered as the hits fed to it depends on this property.
    this.setState({ searchKey: searchTerm})

    if (this.needsToSearchTopStories(searchTerm)) {
      this.searchTopStories(searchTerm)
    }

    event.preventDefault()
  }

  onDismiss(id) {
    console.log(`Dismissing id: ${id}`)

    const { searchKey, results } = this.state
    const { hits, page }  = results[searchKey]

    const isNotID = item => item.objectID !== id
    const updatedHits = hits.filter(isNotID)
    this.setState(
      {
        results: {...results, [searchKey]: {hits: updatedHits, page}}
      }
      )
  }

  searchTopStories(searchTerm, page = 0) {

    console.log(`Search term in sTS: ${searchTerm}`)

    console.log(`Visiting: ${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HITSPERPAGE}${DEFAULT_HITSPERPAGE}`)

    this.setState(
      {
        isLoading: true
      }
    )

    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HITSPERPAGE}${DEFAULT_HITSPERPAGE}`)
      .then((result) => {
        console.log(`No of hits in fetch response: ${result.data.hits.length}`)
        if (this._isMounted) {
          this.setSearchTopStories(result.data)
        }
      })
      .catch(error => {
        console.log(`Fetch failed: ${error.message}`)
        this.setState(
          {error}
        )
      })
  }

  componentDidMount() {
    const { searchTerm } = this.state

    this._isMounted = true

    console.log(`Search term in cDM: ${searchTerm}`)

    this.setState({searchKey: searchTerm})

    this.searchTopStories(searchTerm)
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state

    const pageNumber = ( results && results[searchKey] && results[searchKey].page) || 0

    const hits = (results && results[searchKey] && results[searchKey].hits) || []

    if (error) {
      return (
        <p>
          {`Something went wrong...${error}`}
        </p>
      )
    }

    return (
      <div className = "page">
        <TextHeader 
        text = "Hey!"
        />
        <ContentManager/>
        <CharacterCounterTextArea
          rows = {5}
          columns = {10}
          placeholder = {"Write your text here..."}
          maxCount = {20}
        />
        <div className = "interactions">
          <Search
            value = {searchTerm}
            onChange = {this.onSearchChange}
            onSubmit = {this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
          <Table
         hits={hits} 
         onDismiss={this.onDismiss}
         />
        <div className = "interactions">
          <ButtonWithLoading
            isLoading = {isLoading}
            onClick = {() => this.searchTopStories(searchKey, pageNumber + 1)}
          >
            More
          </ButtonWithLoading>
      </div>
      </div>
    )
  }
}

export default App;
