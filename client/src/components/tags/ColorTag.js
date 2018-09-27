import React from "react";

const ColorTag = props => {
  return (
    <div>
      <span>{props.tagname}</span>
      <br />
      <span>{props.id}</span>
      <br />
      <br />
    </div>
  );
};

export default ColorTag;
