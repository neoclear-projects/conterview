import { Progress } from 'antd';
import { Label } from 'semantic-ui-react';
import './question-select.css';

function getLabel(passed) {
  return passed ? (
    <Label className='question-select-label' as='a' color='green' tag>
      All Passed
    </Label>
  ) : (
    <Label className='question-select-label' as='a' color='red' tag>
      Not passed
    </Label>
  );
}

export default function QuestionSelect({
  content,
  onClick,
  checked,
  passed = false,
  grade = 0.0
}) {
  return (
    <div className={checked ? 'question-selected' : 'question-select'} onClick={onClick}>
      <div className='question-select-header'>
        <div className='question-select-title'>
          { content }
        </div>
        { getLabel(passed) }
      </div>
      <Progress
        strokeColor={{
          from: '#108ee9',
          to: '#87d068',
        }}
        active
        percent={grade}
      />
    </div>
  );
};
