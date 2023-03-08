import "./App.css";
import Node from "./components/node";
import { Fragment, useEffect, useState } from "react";

function App() {
  const [nodeData, setNodeData] = useState([]);
  const [learningRate, setLearningRate] = useState(0.1);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(1);
  const [radius, setRadius] = useState(1);
  const [row, setRow] = useState(3);
  const [col, setCol] = useState(4);
  useEffect(() => {
    let nodes = [];
    for (let i = 0; i < row; i++) {
      let subRow = [];
      for (let j = 1; j <= col; j++) {
        subRow.push({
          name: col * i + j,
          weights: [randomWeight(), randomWeight()],
        });
      }
      nodes.push(subRow);
    }
    setNodeData(nodes);
    setData([
      [0.3, 0.3],
      [0.2, 0.3],
      [0.1, 0.5],
      [0.15, 0.4],
      [0.4, 0.8],
      [0.8, 0.9],
      [0.7, 0.9],
      [0.85, 0.15],
      [0.8, 0.1],
      [0.9, 0.2],
    ]);
  }, []);

  const randomWeight = () => {
    let weight = Math.floor(Math.random() * 20) / 20;
    return weight === 0 ? 0.05 : weight;
  };

  const round2Decimal = (num) => {
    return Math.round(num * 100) / 100;
  };
  const handlePredict = () => {
    clearColor();
    let result = "Prediction Result \n";
    for (let rec = 0; rec < data.length; rec++) {
      let distances = [];
      for (let i = 0; i < nodeData.length; i++) {
        for (let j = 0; j < nodeData[i].length; j++) {
          let distance =
            Math.abs(nodeData[i][j].weights[0] - data[rec][0]) +
            Math.abs(nodeData[i][j].weights[1] - data[rec][1]);
          distances.push({
            distance: distance,
            nodeRow: i,
            nodeCol: j,
          });
        }
      }
      // Sort by distance
      distances.sort((a, b) => {
        return a.distance - b.distance;
      });
      result += `Record ${rec + 1}: ${
        nodeData[distances[0].nodeRow][distances[0].nodeCol].name
      } \n`;
    }
    document.getElementById("result").innerText = result;
  };
  const clearColor = () => {
    for (let i = 0; i < nodeData.length; i++) {
      for (let j = 0; j < nodeData[i].length; j++) {
        document.getElementById(
          `node-${nodeData[i][j].name}`
        ).style.backgroundColor = "lightblue";
      }
    }
  };
  const handleRun = () => {
    clearColor();
    // Find distance between current record and all node
    let result = "Training Result\n";
    let distances = [];
    for (let i = 0; i < nodeData.length; i++) {
      for (let j = 0; j < nodeData[i].length; j++) {
        let distance =
          Math.abs(nodeData[i][j].weights[0] - data[currentIndex][0]) +
          Math.abs(nodeData[i][j].weights[1] - data[currentIndex][1]);
        distances.push({
          distance: distance,
          nodeRow: i,
          nodeCol: j,
        });
        result += `D(${nodeData[i][j].name}) = ${round2Decimal(
          distance
        )} (Old weight: ${JSON.stringify(nodeData[i][j].weights)})\n`;
      }
    }
    // Sort by distance
    distances.sort((a, b) => {
      return a.distance - b.distance;
    });
    result += `Winner: ${
      nodeData[distances[0].nodeRow][distances[0].nodeCol].name
    } \n`;

    let nodeDataCopy = [...nodeData.map((row) => [...row])];
    // Update the weights of node in radius of closest node
    for (
      let i = distances[0].nodeRow - radius;
      i <= distances[0].nodeRow + radius;
      i++
    ) {
      for (
        let j = distances[0].nodeCol - radius;
        j <= distances[0].nodeCol + radius;
        j++
      ) {
        if (i >= 0 && i < nodeData.length && j >= 0 && j < nodeData[i].length) {
          let node = nodeDataCopy[i][j];
          node.weights[0] = round2Decimal(
            node.weights[0] +
              learningRate * (data[currentIndex][0] - node.weights[0])
          );
          node.weights[1] = round2Decimal(
            node.weights[1] +
              learningRate * (data[currentIndex][1] - node.weights[1])
          );
          nodeDataCopy[i][j] = node;
          document.getElementById(`node-${node.name}`).style.backgroundColor =
            "lightgreen";
        }
      }
    }
    // Update the nodeData
    setNodeData(nodeDataCopy);
    // Update the current index
    if (currentIndex === data.length - 1) {
      setCurrentEpoch(currentEpoch + 1);
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
    document.getElementById("result").innerText = result;
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${col}, 1fr)`,
          width: "360px",
        }}
      >
        {nodeData.map((row, rowIndex) => {
          return (
            <Fragment>
              {row.map((node, index) => {
                return <Node key={rowIndex + "-" + index} {...node} />;
              })}
            </Fragment>
          );
        })}
      </div>
      <div>
        Learning Rate: {round2Decimal(learningRate)}{" "}
        <button onClick={() => setLearningRate(learningRate - 0.1)}>-</button>
        <button onClick={() => setLearningRate(learningRate + 0.1)}>+</button>
      </div>
      <div>
        Radius: {radius}{" "}
        <button onClick={() => setRadius(radius - 1)}>-</button>
        <button onClick={() => setRadius(radius + 1)}>+</button>
      </div>
      <div>Epoch: {currentEpoch}</div>
      <div>Current Record: {currentIndex + 1}</div>
      <div>
        <table>
          <tr>
            <th></th>
            <th>Feature 1</th>
            <th>Feature 2</th>
          </tr>
          {data.map((d, index) => {
            return (
              <tr>
                <td>Record #{index + 1}</td>
                <td>{d[0]}</td>
                <td>{d[1]}</td>
              </tr>
            );
          })}
        </table>
      </div>
      <button onClick={handleRun}>train</button>
      <button onClick={handlePredict}>Predict</button>
        <div id="result"></div>
    </div>
  );
}

export default App;
