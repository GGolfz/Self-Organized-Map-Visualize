import { Fragment } from "react";
const Node = ({ name, weights }) => {
  return (
    <Fragment>
      <div
        style={{
          width: "100px",
          height: "100px",
          background: "lightblue",
          borderRadius: "50px",
          margin: "1rem",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
        id={`node-${name}`}
      >
        <div style={{ fontWeight: "bold", marginBottom: ".25rem" }}>{name}</div>
        <div>{JSON.stringify(weights)}</div>
      </div>
    </Fragment>
  );
};

export default Node;
