import * as React from "react";
import SearchResult from "./SearchResult";

class SearchResultTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videos: this.props.data.items
    };
  }

  getLanguages() {
    const languages = { All: this.props.data.items.length, Unspecified: 0 };
    this.props.data.items.forEach(item => {
      const lang = item.snippet.defaultLanguage || item.snippet.defaultAudioLanguage;
      if (lang && languages[lang]) {
        languages[lang]++;
      } else if (lang) {
        languages[lang] = 1;
      } else {
        languages["Unspecified"]++;
      }
    });
    return languages;
  }

  filterByLanguage(e) {
    const lang = e.target.value;
    //const lang = document.getElementById("languageFilter").value;
    const videos = this.props.data.items;
    console.log("Showing videos for language", lang);
    if (lang === "All") {
      this.setState({ videos: videos });
    } else if (lang === "Unspecified") {
      this.setState({
        videos: videos.filter(
          video => !video.snippet.defaultLanguage && !video.snippet.defaultAudioLanguage
        )
      });
    } else {
      this.setState({
        videos: videos.filter(
          video =>
            video.snippet.defaultLanguage === lang ||
            video.snippet.defaultAudioLanguage === lang
        )
      });
    }
  }

  render() {
    const languages = this.getLanguages();
    return (
      <table>
        <tbody>
          <tr>
            <td>
              Filter by language:
              <select
                id="languageFilter"
                onChange={this.filterByLanguage.bind(this)}
              >
                {Object.keys(languages).map((lang, index) => {
                  return (
                    <option key={index} value={lang}>
                      {lang + " (" + languages[lang] + ")"}
                    </option>
                  );
                })}
              </select>
            </td>
          </tr>
          {this.state.videos.map((item, index) => (
            <SearchResult key={index} videoId={item.id.videoId} {...item.snippet} />
          ))}
        </tbody>
      </table>
    );
  }
}

export default SearchResultTable;
