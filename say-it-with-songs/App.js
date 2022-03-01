import React from "react";
import { SearchComponent } from "./components/SearchComponent"
import { TranslationComponent } from "./components/TranslationComponent"
import "./styles/style.css"

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      tokens: [],
    };
    this.apiUrl = "https://sonntagc.uber.space/soundcloud/api";
  }

  createEmbedding = (word, embedUrl, title) => {
    let element = React.createElement("span", {className: "song-word"}, word);

    if (embedUrl.length > 0) {
      // If embedUrl exists, overwrite word with SoundCloud iframe.
      const regexp = "(.+tracks[%2F\\/]+[0-9]+)(?:(?:\\&[^\\&\\s]+\\=[^\\&\\s]+)+)"
      let base_url = embedUrl.match(regexp)
      if (base_url != null && base_url.length > 1) {
        base_url = base_url[1] + "&color=%23ff5500&auto_play=false&hide_related=yes&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false&show_artwork=false"
      }
      element = React.createElement(
          "iframe",
          {
            width: title.length*9 + 110,
            height: "70",
            style: {marginRight: 6},
            scrolling: "no",
            frameBorder: "no",
            src: base_url == null ? embedUrl : base_url
          }, "")
    }

    return element;
  }

  translateWords = (text) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    };
    fetch(this.apiUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          let words = data.words;
          let embeddings = [];
          for (let i = 0; i < words.length; i++) {
            embeddings.push(this.createEmbedding(words[i].word, words[i].embedUrl, words[i].title))
          }

          this.setState({tokens: embeddings})
        }).catch(e => console.log(e))
  }

  translateText = (state) => {
    let words = state.tokens; //: array(str)
    let text = state.text; //: str

    this.translateWords(text)
    this.setState({text: state.text})
  }

  render() {
    return(
      <div>
        <SearchComponent onChange={this.translateText}></SearchComponent>
        <TranslationComponent text={this.state.text} tokens={this.state.tokens}></TranslationComponent>
      </div>
    )
  }
}
