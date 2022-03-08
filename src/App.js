import React, {useState} from 'react'
import './App.css';
import 'react-force-graph-2d'
import ForceGraph from "react-force-graph-2d";
import FileInput from "./FileInput";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileIsOpen: false,
      data: this.genRandomTree(10),
      keys: {},
      values: {},
    }
  }

  getColor(n) {
    return '#' + ((n * 1234567) % Math.pow(2, 24)).toString(16).padStart(6, '0');
  }

  nodePaint({id, x, y}, color, ctx, values) {
    const drawTringle = () => {
      ctx.beginPath();
      ctx.moveTo(x, y - 5);
      ctx.lineTo(x - 5, y + 5);
      ctx.lineTo(x + 5, y + 5);
      ctx.fill();
    }
    const drawText = () => {
      ctx.fillStyle = color;
      ctx.font = '10px Sans-Serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(values[id], x, y);
    }
    (values[id] === undefined) ? drawTringle() : drawText();
  }

  genRandomTree(N = 300, reverse = false) {
    return {
      nodes: [...Array(N).keys()].map(i => ({id: i})),
      links: [...Array(N).keys()]
        .filter(id => id)
        .map(id => ({
          [reverse ? 'target' : 'source']: id,
          [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
        }))
    };
  }

  makeData(dat) {
    let current_index = 1;
    let keys = {
      "M2": 0
    }
    let values = {
      0: "M2"
    }
    let topology = {
      nodes: [
        {id: 0}
      ],
      links: []
    }
    let trips = {};
    let trips_counts = {};
    dat = JSON.parse(dat)
    let current;
    for (let join in dat) {
      current = {id: current_index}
      keys[dat[join]["address"]] = current_index
      values[current_index] = dat[join]["address"]
      topology.nodes.push(
        current
      )
      let trip = "" + dat[join]["line"] + "_" + dat[join]["station"]
      if (trips[trip] !== undefined) {
        topology.links.push(
          {source: current_index, target: trips[trip]}
        )
        trips_counts[trip]++;
      } else {
        trips_counts[trip] = 1
        topology.nodes.push(
          {id: 1000 + current_index}
        )
        trips[trip] = 1000 + current_index
        topology.links.push(
          {source: 1000 + current_index, target: keys[dat[join]["station"]]}
        )
        topology.links.push(
          {source: current_index, target: 1000 + current_index}
        )
      }
      current_index++;
    }
    for (var tr in trips_counts) {
      if (trips_counts[tr] === 1) {

      }
    }
    this.setState({data: topology, fileIsOpen: true, keys: keys, values: values})
  }

  render() {
    return (
      <div className="App">
        <p>
          {(this.state.fileIsOpen) ?
            <ForceGraph
              className="App-header"
              graphData={this.state.data}
              nodeLabel="id"
              nodeCanvasObject={
                (node, ctx) => this.nodePaint(
                  node, this.getColor(node.id), ctx, this.state.values
                )
              }
              nodePointerAreaPaint={this.nodePaint}
            />
            : <FileInput sendData={data => this.makeData(data)}/>
          }
        </p>
      </div>
    );
  }
}
