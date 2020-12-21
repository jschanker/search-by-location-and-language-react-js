import * as React from "react";
import ExpandableSelection from "./ExpandableSelection";

class GoogleSearchResult extends React.Component {
  constructor(props) {
    super(props);
  }

  getImage(item) {
    const img = (item.pagemap && item.pagemap.cse_thumbnail && item.pagemap.cse_thumbnail[0]) 
      || (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image[0]) || "";
    const width = 120;  

    // change && to || and adjust for calculation later
    return <img src={img.src || ""} width={width} height={img.height*width/img.width || width} />;
  }

  render() {
    return (
      <tr>
        <td style={{ "verticalAlign": "top" }}>
          {this.getImage(this.props)}
        </td>
        <td>
          <h2>
            <a href={this.props.link || this.props.displayLink || "https://www.google.com/"}>
              {this.props.title || this.props.htmlTitle}
            </a>
          </h2>
          <p>
            {this.props.snippet || this.props.htmlSnippet}
          </p>
        </td>
      </tr>
    );
  }
}

export default GoogleSearchResult;
