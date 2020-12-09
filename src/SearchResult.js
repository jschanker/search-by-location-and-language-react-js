import * as React from "react";
import ExpandableSelection from "./ExpandableSelection";

class SearchResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td style={{ "verticalAlign": "top" }}>
          <img src={this.props.thumbnails.default.url} />
        </td>
        <td>
          <h2>
            <a href={"https://www.youtube.com/watch?v=" + this.props.videoId}>
              {this.props.title}
            </a>
          </h2>
          <h3>
            <a href={"https://www.youtube.com/channel/" + this.props.channelId}>
              {this.props.channelTitle}
            </a>
            <br />
            Published At <time>{this.props.publishedAt}</time>
            <br />
            Language: {this.props.defaultLanguage || this.props.defaultAudioLanguage}
          </h3>
          <p><span className = "heading">Description</span>: <ExpandableSelection>{this.props.description}</ExpandableSelection></p>
          <p><span className = "heading">Tags</span>: <ExpandableSelection>{(this.props.tags || "None").toString()}</ExpandableSelection></p>
        </td>
      </tr>
    );
  }
}

export default SearchResult;
