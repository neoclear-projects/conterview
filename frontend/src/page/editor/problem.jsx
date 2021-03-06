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

function prefix() {
	if (window.localStorage.getItem('organizationId') != undefined) {
		return `organization/${window.localStorage.getItem('organizationId')}`;
	}
	else {
		return `organization/0`;
	}
}

function Problem({
  problemName,
  description,
  preferedLang
}) {

  return (
    <div>
      <div className='tab-header'>
        Problem Description
      </div>
      <div id='problem'>
        <Header>{problemName}</Header>
        <Divider />
        <ReactMarkdown renderers={renderers}>{description}</ReactMarkdown>
        <Divider />
        <div><b>Prefered Language: </b>{preferedLang}</div>
      </div>
    </div>
  );
}

export default Problem;
