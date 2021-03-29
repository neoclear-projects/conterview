import { getCookie } from '../util/get-cookie';
import req from './req';

// export type InterviewState = 'pending' | 'running' | 'finished';

export function getInterviewState(positionId: string, interviewId: string, onSuccess: (state: any) => void, onError: (err: string) => void) {
  req
    .get(`/organization/${getCookie('organization-id')}/position/${positionId}/interview/${interviewId}/`)
    .then(res => {
      onSuccess(res.data);
    })
    .catch(reason => onError(reason));
};

export function interviewStart(positionId: string, interviewId: string, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({status:'running'});
  req
    .patch(`/organization/${getCookie('organization-id')}/position/${positionId}/interview/${interviewId}/status`, data)
    .then(() => {
      console.log('What the fuck')
      onSuccess();
    })
    .catch(err => onError(err));
};

export function interviewStop(positionId: string, interviewId: string, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({status:'finished'});
  req
    .patch(`/organization/${getCookie('organization-id')}/position/${positionId}/interview/${interviewId}/status`, data)
    .then(() => {
      onSuccess();
    })
    .catch(err => onError(err));
};

export function updateCurrentQuestion(positionId: string, interviewId: string, questionIdx: number, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({index:questionIdx});
  req
    .patch(`/organization/${getCookie('organization-id')}/position/${positionId}/interview/${interviewId}/current-problem-index`, data)
    .then(res => {
      onSuccess();
    })
    .catch(err => onError(err));
}

export function updateRubric(positionId: string, interviewId: string, questionIdx: number, rubricIdx: number, grade: number, onSuccess: () => void, onError: (err: string) => void) {
  let data = JSON.stringify({
    grade:{
      idx: rubricIdx,
      value: grade
    }
  });
  req
    .patch(`/organization/${getCookie('organization-id')}/position/${positionId}/interview/${interviewId}/problem/${questionIdx}/evaluation`, data)
    .then(res => {
      onSuccess();
    })
    .catch(err => onError(err));
}
