import React from "react";

export class TranslationComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    const elements = this.props.tokens.map((el) => el)
    return (
        <div className={"song-text"}>
          <p>{elements}</p>
        </div>
    );
  }
}

