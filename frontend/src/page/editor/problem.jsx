import Text from 'antd/lib/typography/Text';
import { useEffect, useState } from 'react';
import { Divider, Header } from 'semantic-ui-react';
import req from '../../api/req';
import './problem.css';

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

  return (
    <div>
      <div className='tab-header'>
        Problem Description
      </div>
      <div id='problem'>
        <Header>{problemName}</Header>
        <Divider />
        <Text>{description}</Text>
        <Divider />
        <div>{preferedLang}</div>
      </div>
    </div>
  );
}

export default Problem;
