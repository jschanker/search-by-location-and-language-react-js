import * as React from "react";

class ExpandableSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFull: false
    };
  }

  hideFull() {
    this.setState({ showFull: false });
  }

  showFull() {
    this.setState({ showFull: true });
  }

  displayFullElement() {
    console.warn("Full");
    return (
      <span>{this.props.children} <a className="clickableLink" onClick={this.hideFull.bind(this)}>Less</a></span>
    )
  }

  displayPartialElement() {
    return (
      <span>{this.props.children.substring(0,200)}...<a className="clickableLink" onClick={this.showFull.bind(this)}>More</a></span>
    )
  }

  render() {
    return (
      this.state.showFull ? this.displayFullElement() : this.displayPartialElement()
    )
  }

}

export default ExpandableSelection;