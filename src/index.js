#!/usr/bin/env node
import { h, render, Component, span } from "ink"
import TextInput from "./components/TextInput"
import List from "./components/List"
import Spinner from "ink-spinner"
process.env.B_LOGGER_CFG = `${__dirname}/../logger.json`
const { run, handle, startUp } = require("copilot-core")


class App extends Component {
  state = {
    input: "",
    items: [],
    starting: true,
    processing: false,
  }
  constructor(props) {
    super(props)
    startUp()
      .then(() => {
        this.setState({
          starting: false
        })
      })
      .catch(e => {
        console.log("Failed to start")
        unmount()
      })
    this.indexToRun = 0
  }
  onInputChange = (e) => {
    //bug on alt+space
    let timer = setTimeout(() => this.setState({ processing: true }), 500)
    if (e) {
      this.setState({ input: e })
      handle(e)
        .then(list => {
          clearTimeout(timer)
          this.setState({
            items: list,
            processing: false,
          })
        })
    } else {
      this.setState({
        items: [],
        input: e || ""
      })
    }
  }
  run(idx) {
    let { items } = this.state
    if (idx < items.length) {
      run(items[idx])
        .then(() => {
          this.setState({
            input: ""
          })
        })
        .catch(e => {
        })
    }
  }
  render() {
    return (
      <span>
        {this.state.starting ? <Spinner green /> :
          <div>
            <div>
              <TextInput
                value={this.state.input}
                placeholder="input commands"
                onChange={this.onInputChange}
                onSubmit={() => { this.run(this.indexToRun); this.indexToRun = 0 }}
              />
            </div>
            <div>
              -------------
            </div>
            {this.state.processing ? <div> <Spinner green /></div> : ""}
            <List items={this.state.items}
              pageSize={10}
              onSubmit={(idx) => { this.run(idx); this.indexToRun = 0 }}
              onSelectedIndexChange={(i) => this.indexToRun = i}
            />
          </div>
        }
      </span>)
  }
}
const unmount = render(<App />)




