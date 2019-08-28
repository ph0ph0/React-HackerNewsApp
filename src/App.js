import React, { Component, useState } from 'react';
import './App.css';

const DEFAULT_QUERY = `redux`
const DEFAULT_HITSPERPAGE = '100'
const PATH_BASE = `https://hn.algolia.com/api/v1`
const PATH_SEARCH = `/search`
const PARAM_SEARCH = `query=`
const PARAM_PAGE = `page=`
const PARAM_HITSPERPAGE = 'hitsPerPage='

class App extends Component {

  constructor(props) {
    super(props) 
    this.state = {
      results: null,
      page: 0,
      searchKey: '',
      searchTerm: DEFAULT_QUERY
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

    const { searchKey, results} = this.state

    console.log(`Setting search top stories`)

    // Consider `const pageNumber = (results && results.page) || 0`. This means, if results and results.page is not null (or falsey),
    // then use the results.page value (the latter of the two), if either are null, use 0. Hence, the below expression means if
    // results and results[searchKey] is not null, use the hits stored under this key. If they are null, use an empty array. 
    // && statements have precendence over other operators, hence bracketing the && statement or not makes no difference. 
    const oldHits = (results && results[searchKey]) ? results[searchKey].hits : []

    const updatedHits = [...oldHits, ...hits]

    console.log(`Number of hits when setting top stories state: ${updatedHits.length}, pageNo.: ${page}`)

    this.setState(
      {
        results: {
          ...results, [searchKey] : {hits: updatedHits, page}
        }
      }
    )
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

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HITSPERPAGE}${DEFAULT_HITSPERPAGE}`)
      .then(response => response.json())
      .then((json) => {
        console.log(`No of hits in fetch response: ${json.hits.length}`)
        this.setSearchTopStories(json)
      })
      .catch(error => console.log(`Fetch failed: ${error.message}`))

  }

  componentDidMount() {
    const { searchTerm } = this.state

    console.log(`Search term in cDM: ${searchTerm}`)

    this.setState({searchKey: searchTerm})

    this.searchTopStories(searchTerm)
  }

  render() {
    const { searchTerm, results, searchKey } = this.state

    const pageNumber = ( results && results[searchKey] && results[searchKey].page) || 0

    const hits = (results && results[searchKey] && results[searchKey].hits) || []

    return (
      <div className = "page">
        <Header 
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
        { 
          results ? 
          <Table
         hits={hits} 
         onDismiss={this.onDismiss}
         />
         : null
        }
        <div className = "interactions">
        <Button onClick= {() => this.searchTopStories(searchKey, pageNumber + 1)}>
          More
        </Button>
      </div>
      </div>
    )
  }
}

const PlusButton = ({ clickAction, clickValue }) => {
  return (
    <button 
    onClick = {() => {clickAction(clickValue)}}
    >
      +{clickValue}
    </button>
  )
}

const ResetButton = ({clickAction}) => {
  return (
    <button onClick = {clickAction}>
      Reset
    </button>
  )
}

const Display = ({ content }) => {
  return (
    <pre>
      {content}
    </pre>
  )
}

const ContentManager = () => {

  var [count, setCount] = useState(0)

  const incrementCounter = (incrementValue) => {
    setCount(count + incrementValue)
  }

  const resetCounter = () => {
    setCount(count = 0)
  }

  return (
    <>
    <PlusButton 
    clickAction = {incrementCounter}
    clickValue = {1}
     />
    <PlusButton
    clickAction = {incrementCounter}
    clickValue = {5}
    />
    <PlusButton 
    clickAction = {incrementCounter} 
    clickValue = {10}
    />
    <Display content= {count} />
    <ResetButton clickAction = {resetCounter} />
    </>
  )
}


const Table = ({hits, onDismiss}) => {

    return (
      <div className="table">
        
        {hits.map(item => 
          <div key={item.objectID} className="table-row">
            <span style = {{ width: '40%'}}>
              <a href={item.url}>
                {item.title} 
              </a>
            </span>
            <span style = {{ width: '30%'}}>
              {item.author}
            </span>
            <span style = {{ width: '10%'}}>
              {item.num_comments}
            </span>
            <span style = {{ width: '10%'}}>
              {item.points}
            </span>
            <span style = {{ width: '10%'}}>
              <Button 
                onClick={() => 
                onDismiss(item.objectID)}
                className="button-inline"
                >
                Dismiss
              </Button>
            </span>
          </div>
        
      )}
      </div>
    )
  }


function Button({ onClick, className, children }) {

      return (
        <button 
          onClick = {onClick}
          className = {className}
          type = "button" 
        >
          {children}
        </button>
      )
  
}

function Search( { value, onChange, onSubmit, children } ) {

    return (
      <form onSubmit = {onSubmit} > 
        <input 
        type = "text"
        value = {value}
        onChange = {onChange}
        />
        <button 
          type = "submit"
        >
          {children}
        </button>
      </form>
    )
}

class Header extends Component {

  render() {

    const { text } = this.props

    return (
      <h1>
        {text}
      </h1>
    )
  }
}

const TextArea = ({ rows, columns, placeholder, value, onChange }) => {
  return (
    <textarea 
        rows = {rows} 
        columns = {columns} 
        placeholder={placeholder}
        value = {value}
        onChange = {onChange} 
        />
  )
}

const CharacterCounter = ({ input, maxCount }) => {

  console.log(`CharNo: ${input.length}`)

  const outputVal = () => {
    return (input.length < maxCount) ? maxCount - input.length : `Over by ${Math.abs(maxCount - input.length)} characters`
  }

  return (
    <div>
      Characters remaining: {outputVal()}
    </div>
  )
}

const CharacterCounterTextArea = ({ rows, columns, placeholder, maxCount }) => {

  // useState react hook provides state for function components via a getter and setter
  var [inputValue, setInputValue] = useState("")

  // called each time the onChange event handler of the text area is called ie each time characters are entered
  const handleChange = (event) => {
    const element = event.target
    setInputValue(element.value)
  }

    return (
      <div>
        <TextArea 
        rows = {rows} 
        columns={columns} 
        placeholder={placeholder}
        value = {inputValue}
        onChange = {handleChange} 
        />
        <div>
          <CharacterCounter
          input = {inputValue}
          maxCount = {maxCount}
          />
        </div>
      </div>
    )
  }


export default App;
