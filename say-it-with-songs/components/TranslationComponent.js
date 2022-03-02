import React from "react";

export class TranslationComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const elements = this.props.tokens.map((el) => el)
    if (this.props.loading) {
      return (
          <div className={"song-text"}>
            <p>Loading ...</p>
          </div>
      );
    } else {
      return (
          <div className={"song-text"}>
            <p>{elements}</p>
          </div>
      );
    }

  }
}

