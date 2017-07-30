#!/usr/bin/env node
import { h, render, Component, span } from "ink"
import TextInput from "ink-text-input"
import { run, handle, startUp } from "copilot-core"
import List from "./components/List"
import Spinner from "ink-spinner"

class App extends Component {
  state = {
    input: "",
    items: [],
    starting: true,
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
  }
  onType = (e) => {
    handle(e)
      .then(list => {
        this.setState({
          items: list
        })
      })
    this.setState({ input: e })
  }
  run(idx) {
    let { items } = this.state
    if (idx < items.length) {
      run(items[idx])
        .catch(e => { })
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
                onChange={this.onType}
                onSubmit={() => this.run(0)}
              />
            </div>
            <div>
              -------------
            </div>
            <List items={this.state.items}
              pageSize={10}
            />
          </div>
        }
      </span>)
  }
}
const unmount = render(<App />)




