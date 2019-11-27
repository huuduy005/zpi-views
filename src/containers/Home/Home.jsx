import React from "react";
import ReactDiff from "react-diff-viewer";

import "./style.css";

import { getSpa, getVerdaccio } from "./fetch";

const P = window.Prism;

function fetchData(branch) {
  return Promise.all([getSpa(branch), getVerdaccio(branch)]);
}

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splitView: true,
      highlightLine: [],
      environment: "develop",
      enableSyntaxHighlighting: true,

      oldValue: JSON.stringify({}, null, 4),
      newValue: JSON.stringify({}, null, 4)
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    fetchData(this.state.environment).then(res => {
      console.log(res);
      const [spa, verdacio] = res;
      this.setState({ oldValue: spa, newValue: verdacio });
    });
  };

  toggleSyntaxHighlighting = () =>
    this.setState({
      enableSyntaxHighlighting: !this.state.enableSyntaxHighlighting
    });

  onChange = () => this.setState({ splitView: !this.state.splitView });

  onLanguageChange = e => {
    this.setState({ environment: e.target.value, highlightLine: [] }, () =>
      this.fetchData()
    );
  };

  onLineNumberClick = (id, e) => {
    let highlightLine = [id];
    if (e.shiftKey && this.state.highlightLine.length === 1) {
      const [dir, oldId] = this.state.highlightLine[0].split("-");
      const [newDir, newId] = id.split("-");
      if (dir === newDir) {
        highlightLine = [];
        const lowEnd = Math.min(Number(oldId), Number(newId));
        const highEnd = Math.max(Number(oldId), Number(newId));
        for (let i = lowEnd; i <= highEnd; i++) {
          highlightLine.push(`${dir}-${i}`);
        }
      }
    }
    this.setState({
      highlightLine
    });
  };

  syntaxHighlight = str => {
    if (!str) return;
    let language;
    language = P.highlight(str, P.languages.json);
    return <span dangerouslySetInnerHTML={{ __html: language }} />;
  };

  render() {
    const { oldValue, newValue } = this.state;
    return (
      <div className="react-diff-viewer-example">
        <div className="controls">
          <select
            name="language"
            id="language"
            onChange={this.onLanguageChange}
            value={this.state.environment}
          >
            <option value="develop">develop</option>
            <option value="staging">staging</option>
            <option value="master">master</option>
          </select>
          <span>
            <label>
              <input
                type="checkbox"
                name="toggle-2"
                id="toggle-2"
                onChange={this.toggleSyntaxHighlighting}
                checked={this.state.enableSyntaxHighlighting}
              />{" "}
              Syntax Highlighting
            </label>
            <label>
              <input
                type="checkbox"
                name="toggle-1"
                id="toggle-1"
                onChange={this.onChange}
                checked={this.state.splitView}
              />{" "}
              Split View
            </label>
          </span>
        </div>
        <div className="diff-viewer">
          <ReactDiff
            highlightLines={this.state.highlightLine}
            onLineNumberClick={this.onLineNumberClick}
            oldValue={oldValue}
            splitView={this.state.splitView}
            newValue={newValue}
            renderContent={
              this.state.enableSyntaxHighlighting && this.syntaxHighlight
            }
          />
        </div>
        <footer>
          Made with 💓 by{" "}
          <a href="" target="_blank">
            zpi
          </a>
        </footer>
      </div>
    );
  }
}
export default Example;
