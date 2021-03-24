import React from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'

// Reference: https://braft.margox.cn/demos/extend
// The official braft doc

class Note extends React.Component {
  state = {
    editorState: BraftEditor.createEditorState(null)
  }

  handleChange = (editorState) => {
    this.setState({ editorState })
  }

  render () {
    const extendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: 'Return To Home Page',
        onClick: () => window.location.href = '/'
      }
    ]

    return (
      <div>
        <BraftEditor id='note' language='en' extendControls={extendControls} />
      </div>
    );
  }
}

export default Note;
