import React from "react";
import Chart from "react-google-charts";
import semver from "semver";
import { getAllListPkg } from "../Home/fetch";

const data = [
  ["Element", "Density", { role: "style" }],
  ["Copper", 100, "#b87333"], // RGB value
  ["Silver", 10, "silver"], // English color name
  ["Gold", 19, "gold"],
  ["Platinum", 21, "color: #e5e4e2"] // CSS-style declaration
];

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getStack(versions) {
  const list = Object.keys(versions).reverse();
  const data = {
    alpha: 0,
    beta: 0,
    live: 0,
    total: list.length
  };

  list.reduce((obj, version) => {
    const sem = semver.parse(version);
    const { prerelease } = sem;

    if (!prerelease.length) {
      // live
      obj.live++;
    } else {
      const [tag] = prerelease;
      obj[tag]++;
    }

    return obj;
  }, data);

  const { alpha, beta, live, total } = data;
  const sum = alpha + beta + live;

  return [alpha + (total - sum), beta, live];
}

class Statistics extends React.Component {
  state = {
    data
  };
  componentDidMount() {
    console.log(this.props.history);

    const { search } = this.props.history.location;

    const params = new URLSearchParams(search);
    params.set('tin', 'qq');
    console.log(params.toString());

    for (let p of params) {
      console.log(p);
    }


    getAllListPkg().then(res => {
      console.log(res);
      const map = res.map(pkg => {
        const { name, versions } = pkg;

        const stack = getStack(versions);

        return [name, ...stack, ''];
      });

      this.setState({
        data: [
          ["Element", "develop", "staging", "live", { role: 'annotation' }],
          ...map
        ]
      });
    });
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        <Chart
          chartType="ColumnChart"
          width="100%"
          height="400px"
          data={data}
          options={{
            title: 'Total versions',
            isStacked: true,
          }}
        />
      </div>
    );
  }
}

export default Statistics;
