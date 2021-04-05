import { notification } from 'antd';
import req from './req';

// export type InterviewState = 'pending' | 'running' | 'finished';
export type languageType = 'cpp' | 'java' | 'python' | 'javascript' | 'typescript';
export type testResult = 'pass' | 'fail' | 'cperror';

export function getInterviewState(positionId: string, interviewId: string, onSuccess: (state: any) => void, onError: (err: string) => void) {
  req
    .get(`/organization/${window.localStorage.getItem('organizationId')}/position/${positionId}/interview/${interviewId}/`)
    .then(res => {
      onSuccess(res.data);
    })
    .catch(reason => onError(reason));
};

export function interviewStart(positionId: string, interviewId: string, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({status:'running'});
  req
    .patch(`/organization/${window.localStorage.getItem('organizationId')}/position/${positionId}/interview/${interviewId}/status`, data)
    .then(onSuccess)
    .catch(err => onError(err));
};

export function interviewStop(positionId: string, interviewId: string, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({status:'finished'});
  req
    .patch(`/organization/${window.localStorage.getItem('organizationId')}/position/${positionId}/interview/${interviewId}/status`, data)
    .then(() => {
      onSuccess();
    })
    .catch(err => onError(err));
};

export function updateCurrentQuestion(positionId: string, interviewId: string, questionIdx: number, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({index:questionIdx});
  req
    .patch(`/organization/${window.localStorage.getItem('organizationId')}/position/${positionId}/interview/${interviewId}/current-problem-index`, data)
    .then(res => {
      onSuccess();
    })
    .catch(err => onError(err));
}

export function updateRubric(positionId: string, interviewId: string, questionIdx: number, rubricIdx: number, grade: number, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({
    grade: {
      idx: rubricIdx,
      value: grade
    }
  });
  req
    .patch(`/organization/${window.localStorage.getItem('organizationId')}/position/${positionId}/interview/${interviewId}/problem/${questionIdx}/evaluation`, data)
    .then(res => {
      onSuccess();
    })
    .catch(err => onError(err));
}

export function updateComment(positionId: string, interviewId: string, questionIdx: number, comment: string, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({
    comment: comment
  });

  req
    .patch(`/organization/${window.localStorage.getItem('organizationId')}/position/${positionId}/interview/${interviewId}/problem/${questionIdx}/evaluation`, data)
    .then(res => {
      onSuccess();
    })
    .catch(err => onError(err));
}

export function testsAllPassed(positionId: string, interviewId: string, questionIdx: number, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({
    allPassed: true
  });
  req
    .patch(`/organization/${window.localStorage.getItem('organizationId')}/position/${positionId}/interview/${interviewId}/problem/${questionIdx}/evaluation`, data)
    .then(res => onSuccess())
    .catch(onError);
}

export function runCode(interviewId: string, code: string, language: languageType, onSuccess: (output: string) => void, onError: (err: any) => void) {
  req.post(
    `exec/run/${interviewId}`,
    JSON.stringify({
      language: language,
      code: code
    })
  )
  .then(res => onSuccess(res.data.output))
  .catch(onError);
}

export function testCode(interviewId: string, code: string, language: languageType, problemId: string, onSuccess: (res: testResult, msg: string) => void, onError: (err: any) => void) {
  req.post(
    `exec/test/${interviewId}/problem/${problemId}`,
    JSON.stringify({
      language: language,
      code: code
    })
  )
  .then(res => onSuccess(res.data.result, res.data.message))
  .catch(onError);
}

export function testPassed(problemName: string) {
  notification['success']({
    message: 'Test Passed',
    description: `All tests from ${problemName} passed`,
  });
}

export function testFailed(problemName: string) {
  notification['error']({
    message: 'Test Failed',
    description: `Some tests from ${problemName} failed`
  })
}

export function testCompilerError(errMessage: string) {
  notification['warning']({
    message: 'Compiler Error',
    description: errMessage
  })
}
