import React from "react";

export class SearchComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: "",
      tokens: []
    };
  }

  handleChange = (e) => {
    let content = e.target.value;
    if (content.slice(-1) === " ") {
      // only submit changes after an empty space has been typed

      let splitted = content.split(" ")
      let suppl = splitted[splitted.length - 2]
      this.state.tokens.push(suppl)

      this.setState({text: content}, this.handleSubmit)
    }
  }

  handleSubmit = (e) => {
    this.props.onChange(this.state);
  }

  render() {
    return (
          <div className={"word-text"}>
            <textarea onChange={this.handleChange} unselectable={"on"}></textarea>
          </div>
    );
  }
}

