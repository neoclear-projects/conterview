import React from 'react';

import CanvasDraw from "react-canvas-draw";

export default class Canvas extends React.Component {
  render() {
    return (
      <CanvasDraw
        lazyRadius={0}
        brushRadius={2}
        brushColor='#999'
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: this.props.colorMode ? '#222' : 'white'
        }}
      />
    );
  }
};
