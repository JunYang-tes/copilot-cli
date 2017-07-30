import { h, Component, Text } from "ink"

export default class List extends Component {
  state = {
    selected: 0,
    page: 0,
  }
  props = {
    items: [],
    pageSize: 10,
  }
  componentDidMount() {
    process.stdin.on('keypress', this.handleKeyPress);
  }

  componentWillUnmount() {
    process.stdin.removeListener('keypress', this.handleKeyPress);
  }
  handleKeyPress = (e, key) => {
    if (key.name === "up" || (key.name === "k" && key.meta)) {
      this.selectPrevious()
    } else if (key.name === "down" || (key.name === "j" && key.meta)) {
      //ctrl + j reports enter key on my computer
      this.selectNext()
    }
  }
  selectPrevious() {
    let { selected, page } = this.state
    let { pageSize } = this.props
    selected -= 1
    if (selected >= 0) {
      if (selected % pageSize === pageSize - 1 && page !== 0) {
        this.setState({
          selected,
          page: page - 1
        })
      } else {
        this.setState({
          selected
        })
      }
    }
  }
  selectNext() {
    let { selected, page } = this.state
    let { pageSize } = this.props
    selected += 1
    if (selected < this.props.items.length) {
      if (selected % pageSize === 0) {
        this.setState({
          selected,
          page: page + 1
        })
      } else {
        this.setState({
          selected
        })
      }
    }
  }
  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      page: 0,
      selected: 0
    })
  }

  render() {
    let { items, pageSize } = this.props
    let { page } = this.state
    let start = page * pageSize
    return (<div>
      {items.slice(start, start + pageSize).map((item, idx) =>
        <div>
          {
            item.title &&
            <div>
              {
                this.state.selected === start + idx &&
                item.title &&
                < Text green>█</Text>
              }
              <Text
                {...{
                  keyword: "yellow",
                }}>
                {" " + item.title}
              </Text>
            </div>
          }

          {
            this.state.selected === start + idx &&
            <Text green>█</Text>
          }
          < Text
            {...{
              keyword: "gray",
            }
            } > {

              (idx < 9 ? `[Alt+${idx + 1}]` : " ") + item.text} </Text>
        </div >
      )}
      {
        items.length > 0 ?
          <div>
            [{page + 1} of {Math.ceil(items.length / pageSize)}] {this.state.selected + 1}
          </div>
          : ""
      }
    </div >)
  }
}