import React from "react";
import { Audio } from "react-loader-spinner";

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
            <p>
              <Audio heigth="50" width="50" color="grey" ariaLabel="loading" />
            </p>
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

