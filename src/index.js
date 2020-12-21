import React, { Component } from "react";
import { render } from "react-dom";
import SearchResult from "./SearchResult";
import SearchResultTable from "./SearchResultTable";
import GoogleSearchResultTable from "./GoogleSearchResultTable";
import sample_video_response from "./sample_video_response";
import sample_google_search_response from "./sample_google_search_response4";
import "./style.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: sample_video_response,
      googleSearchResults: sample_google_search_response,
      showGoogleSearchResults: true,
      showYouTubeSearchResults: true
    };
  }

  makeRequest(api, request, type, key, callback) {
    if(!request.key) {
      request.key = key;
    }
    /*
    if(!request.part) {
      request.part = "snippet";
    }
    */
    const queryString = encodeURI(
      Object.keys(request)
        .map(prop => prop + "=" + request[prop])
        .join("&")
    );
    const requestURL = "https://www.googleapis.com/" + api + "/" + type + "?" + queryString;
    console.log("Making request to", requestURL);
    fetch(requestURL)
      .then(response => response.json())
      .then(callback)
      .catch(error => console.error(error));
  }

  joinVideoInfo(searchResults, key) {
    if (key && searchResults.length) {
      this.makeRequest("youtube/v3",
        {
          id: searchResults.map(searchResult => searchResult.id.videoId).join(","),
          part: "snippet,recordingDetails"
        }, "videos", key, response => {
          return response.items.forEach((video, index) => {
            console.log("VIDEO INFO:", JSON.stringify(video));
            Object.keys(video).forEach(prop => {
              searchResults[index][prop] = video[prop];
            });
            return video;
          });
      });
    }
  }

  doSearch() {
    this.setState({showYouTubeSearchResults: true});
    this.setState({showGoogleSearchResults: false});
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
    request.part = "snippet";

    const key = prompt("Enter YouTube API key: ");

    if (key) {
      this.makeRequest("youtube/v3", request, "search", key, results => {
        console.log("VIDEO RESULTS", results);
        this.setState({
          searchResults: results
        });
        this.joinVideoInfo(results.items, key)
/*
        results.items.forEach(searchResult =>
          this.joinVideoInfo(searchResult, key)
        );
*/
      });
    }
  }

  doSearchGoogle() {
    this.setState({showYouTubeSearchResults: false});
    this.setState({showGoogleSearchResults: true});

    const key = prompt("Enter Google Custom Search API key: "); 
    const cx = prompt("Enter search custom search engine id:"); 

    if (key && cx) {
      this.makeRequest("customsearch/v1",
        {
          q: document.getElementById("q").value, 
          lr: "lang_" + document.getElementById("lr").value,
          cr: "country" + document.getElementById("cr").value.toUpperCase(),
          cx: cx 
        },
        "",
        key,
        results => {
          console.log("Google Search Results", results);
          this.setState({
            googleSearchResults: results
          });
        }
      );
    }
  }

  showSearchResults() {
    if(this.state.showYouTubeSearchResults && this.state.showGoogleSearchResults) {
      return (
        <div>
          <SearchResultTable data={this.state.searchResults} />
          <GoogleSearchResultTable data={this.state.googleSearchResults} />
        </div>
      );
    }
    else if(this.state.showYouTubeSearchResults) {
      return (
        <div>
          <SearchResultTable data={this.state.searchResults} />
        </div>
      )
    }
    else if(this.state.showGoogleSearchResults) {
      return (
        <div>
          <GoogleSearchResultTable data={this.state.googleSearchResults} />
        </div>
      )
    }
    /*
    return
      (this.state.showYouTubeSearchResults ? 
        <SearchResultTable data={this.state.searchResults} /> : "")    
      (this.state.showGoogleSearchResults ? 
        <GoogleSearchResultTable data={this.state.googleSearchResults} /> : "")
    */     
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
                Location: <input id="location" defaultValue="21.6139,78.2090" /> (<em>YouTube</em> only)
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
                km (<em>YouTube</em> only)
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
                Country:{" "}
                <input
                  id="cr"
                  defaultValue="IN"
                />{" "} (<em>Google search</em> only)
              </td>
            </tr>
            <tr>
              <td>
                Language:{" "}
                <input
                  id="lr"
                  defaultValue="hi"
                />{" "} (<em>Google search</em> only; use dropdown for YouTube)
              </td>
            </tr>
            <tr>
              <td>
                <button onClick={this.doSearch.bind(this)}>Search YouTube</button>
                &nbsp;
                <button onClick={this.doSearchGoogle.bind(this)}>Search Google</button>
              </td>
            </tr>
          </tbody>
        </table>
        {this.showSearchResults()}
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
