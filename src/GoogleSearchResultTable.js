import * as React from "react";
import GoogleSearchResult from "./GoogleSearchResult";

class GoogleSearchResultTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table>
        <tbody>
          {this.props.data.items.map((item, index) => (
            <GoogleSearchResult key={index} {...item} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default GoogleSearchResultTable;
