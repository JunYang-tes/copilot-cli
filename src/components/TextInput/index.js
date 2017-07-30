import { h, Component, Text } from "ink"
import TextInput from "ink-text-input"
import timer from "../../hoc/timer"
//TODO:improve this component
@timer
export default class MyTextInput extends Component {
  state = {
    cursor: true
  }
  componentDidMount() {
    let { setInterval } = this.props
    setInterval(() => {
      this.setState({
        cursor: !this.state.cursor
      })
    }, 500)
  }
  render() {
    return (<span>
      <TextInput
        {...this.props}
      />
      {
        this.state.cursor ? "█" : ""
      }
    </span>)
  }
}