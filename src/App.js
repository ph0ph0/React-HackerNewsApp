import React, { Component, useState } from 'react';
import './App.css';
import axios from 'axios'
import PropTypes from 'prop-types'

const DEFAULT_QUERY = `redux`
const DEFAULT_HITSPERPAGE = '100'
const PATH_BASE = `https://hn.algolia.com/api/v1`
const PATH_SEARCH = `/search`
const PARAM_SEARCH = `query=`
const PARAM_PAGE = `page=`
const PARAM_HITSPERPAGE = 'hitsPerPage='

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
        },
        isLoading: false
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
    const { searchTerm, results, searchKey, error, isLoading, page } = this.state

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
          <Table
         hits={hits} 
         onDismiss={this.onDismiss}
         />
        <div className = "interactions">
          <ButtonWithLoading
            isLoading = {isLoading}
            onClick = {() => this.searchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
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

const LoadingComponent = () => {
  return (
    <div>
      Loading...
    </div>
  )
}

const withLoading = (Component) => ({isLoading, ...rest}) => {
  return (
    isLoading ?
    <LoadingComponent/> :
    <Component {...rest} />
  )
}

const ButtonWithLoading = withLoading(Button)

PlusButton.propTypes = {
  clickAction: PropTypes.func.isRequired,
  clickValue: PropTypes.number.isRequired
}

const ResetButton = ({clickAction}) => {
  return (
    <button onClick = {clickAction}>
      Reset
    </button>
  )
}

ResetButton.propTypes = {
  clickAction: PropTypes.func.isRequired
}

const Display = ({ content }) => {
  return (
    <pre>
      {content}
    </pre>
  )
}

Display.propTypes = {
  content: PropTypes.number
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

  Table.propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDismiss: PropTypes.func
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

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
}

class Search extends Component {

  componentDidMount() {
    if (this.input) {
      this.input.focus()
    }
  }

  render() {

  const { value, onChange, onSubmit, children } = this.props

  return (
    <form onSubmit = {onSubmit} > 
      <input 
      type = "text"
      value = {value}
      onChange = {onChange}
      ref = {el => this.input = el} 
      />
      <button 
        type = "submit"
      >
        {children}
      </button>
    </form>
  )
  }
}

Search.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node
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

TextArea.propTypes = {
  rows: PropTypes.number.isRequired,
  columns: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
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

CharacterCounter.propTypes = {
  input: PropTypes.string.isRequired,
  maxCount: PropTypes.number.isRequired
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

  CharacterCounterTextArea.propTypes = {
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    placeholder: PropTypes.string.isRequired,
    maxCount: PropTypes.number.isRequired
  }


export default App;
