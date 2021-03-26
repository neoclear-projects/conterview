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
  req
    .get(`/organization/${getCookie('organization-id')}/position/${positionId}/interview/${interviewId}/start`)
    .then(() => {
      console.log('What the fuck')
      onSuccess();
    })
    .catch(err => onError(err));
};

export function interviewStop(positionId: string, interviewId: string, onSuccess: () => void, onError: (err: string) => void) {
  req
    .get(`/organization/${getCookie('organization-id')}/position/${positionId}/interview/${interviewId}/end`)
    .then(() => {
      onSuccess();
    })
    .catch(err => onError(err));
};

export function updateCurrentQuestion(positionId: string, interviewId: string, questionIdx: number, onSuccess: () => void, onError: (err: string) => void) {
  req
    .get(`/organization/${getCookie('organization-id')}/position/${positionId}/interview/${interviewId}/problem/${questionIdx}`)
    .then(res => {
      onSuccess();
    })
    .catch(err => onError(err));
}
