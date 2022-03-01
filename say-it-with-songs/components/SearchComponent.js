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
    if ((content.slice(-1) === " ") || e.nativeEvent.inputType === "deleteContentBackward") {
      // only submit changes after an empty space has been typed or something has been deleted.
      let splitted = content.split(" ")

      this.setState({
        text: content,
        tokens: splitted
      }, this.handleSubmit)
    }
  }

  handleSubmit = (e) => {
    this.props.onChange(this.state);
  }

  render() {
    return (
          <div className={"word-text"}>
            <textarea onChange={this.handleChange}></textarea>
          </div>
    );
  }
}

