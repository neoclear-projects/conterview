import { useState } from 'react';
import ReactMarkdown from 'react-markdown'
import { Divider, Header } from 'semantic-ui-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import req from '../../api/req';
import './problem.css';

const renderers = {
  code: ({language, value}) => {
    return <SyntaxHighlighter style={tomorrow} language={language} children={value} />
  }
};

function Problem({
  problemId
}) {

  const [problemName, setProblemName] = useState('');
  const [description, setDescription] = useState('');
  const [preferedLang, setPreferedLang] = useState('');

  if (problemId != null) {
    req
      .get(`/problemSet/${problemId}`)
      .then(res => {
        const dat = res.data;
        setProblemName(dat.problemName);
        setDescription(dat.description);
        setPreferedLang(dat.preferedLanguage);
      })
      .catch(err => console.log(err));
  }

  const text = `
  ### Description: Here's what you need
  
  #### The problem needs several inputs

  1. First example

  \`\`\`js
  var React = require('js')
  \`\`\`

  2. Second example
  `;

  return (
    <div>
      <div className='tab-header'>
        Problem Description
      </div>
      <div id='problem'>
        <Header>{problemName}</Header>
        <Divider />
        {/* <Text>{description}</Text> */}
        <ReactMarkdown renderers={renderers}>{text}</ReactMarkdown>
        <Divider />
        <div>{preferedLang}</div>
      </div>
    </div>
  );
}

export default Problem;
