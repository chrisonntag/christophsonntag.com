import React from "react";

export class SearchComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: "And medicine, law, business, engineering, these are noble pursuits and necessary to sustain life. But poetry, beauty, romance, love, these are what we stay alive for.",
    };
  }

  componentDidMount() {
    this.props.onChange(this.state);
  }

  handleChange = (e) => {
    let content = e.target.value;
    if ((content.slice(-1) === " ") || e.nativeEvent.inputType === "deleteContentBackward") {
      // only submit changes after an empty space has been typed or something has been deleted.
      this.setState({
        text: content,
      }, this.handleSubmit)
    }
  }

  handleSubmit = (e) => {
    this.props.onChange(this.state);
  }

  render() {
    return (
          <div className={"word-text"}>
            <textarea onChange={this.handleChange}>{this.state.text}</textarea>
          </div>
    );
  }
}

