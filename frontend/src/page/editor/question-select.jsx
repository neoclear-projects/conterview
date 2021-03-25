import './question-select.css';

export default function QuestionSelect({
  content,
  onClick,
  checked
}) {
  return (
    <div className={checked ? 'question-selected' : 'question-select'} onClick={onClick}>
      {content}
    </div>
  );
};
