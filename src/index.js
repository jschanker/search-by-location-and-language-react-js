import React, { Component } from "react";
import { render } from "react-dom";
import SearchResult from "./SearchResult";
import SearchResultTable from "./SearchResultTable";
import sample_video_response from "./sample_video_response";
import "./style.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: sample_video_response
    };
  }

  makeRequest(request, type, key, callback) {
    if(!request.key) {
      request.key = key;
    }
    if(!request.part) {
      request.part = "snippet";
    }
    const queryString = encodeURI(
      Object.keys(request)
        .map(prop => prop + "=" + request[prop])
        .join("&")
    );
    const requestURL = "https://www.googleapis.com/youtube/v3/" + type + "?" + queryString;
    console.log("Making request to", requestURL);
    fetch(requestURL)
      .then(response => response.json())
      .then(callback)
      .catch(error => console.error(error));
  }

  joinVideoInfo(searchResult, key) {
    if (key) {
      this.makeRequest({id: searchResult.id.videoId}, "videos", key, video => {
        const videoInfo = video.items[0]//.snippet;
        console.log("VIDEO INFO:", JSON.stringify(videoInfo));
        Object.keys(videoInfo).forEach(prop => {
          searchResult[prop] = videoInfo[prop];
        });
        return videoInfo;
      })
    }
  }

  doSearch() {
    const request = { q: "", location: "", locationRadius: "", maxResults: 50 };
    Object.keys(request).forEach(prop => {
      request[prop] = document.getElementById(prop).value;
    });
    if (request.location && !request.locationRadius) {
      request.locationRadius = "1000";
    }
    if (request.locationRadius && !request.location) {
      request.location = "21.6139,78.2090";
    }
    if (request.locationRadius) {
      request.locationRadius += "km";
    }

    request.type = "video";

    const key = prompt("Enter YouTube API key: ");

    if (key) {
      this.makeRequest(request, "search", key, results => {
        console.log("VIDEO RESULTS", results);
        this.setState({
          searchResults: results
        });
        results.items.forEach(searchResult =>
          this.joinVideoInfo(searchResult, key)
        );
      });
    }
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                Search Term: <input id="q" defaultValue="mathematical induction" />
              </td>
            </tr>
            <tr>
              <td>
                Location: <input id="location" defaultValue="21.6139,78.2090" />
              </td>
            </tr>
            <tr>
              <td>
                Location Radius:{" "}
                <input
                  id="locationRadius"
                  type="number"
                  min="0"
                  max="1000"
                  defaultValue="1000"
                />{" "}
                km
              </td>
            </tr>
            <tr>
              <td>
                Maximum Results:{" "}
                <input
                  id="maxResults"
                  type="number"
                  min="0"
                  max="50"
                  defaultValue="50"
                />{" "}
              </td>
            </tr>
            <tr>
              <td>
                <button onClick={this.doSearch.bind(this)}>Search YouTube</button>
              </td>
            </tr>
          </tbody>
        </table>
        <SearchResultTable data={this.state.searchResults} />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
