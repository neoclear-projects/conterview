import req from './req';
import singleProblem from '../components/problem-set/single-problem'
import { AxiosResponse } from 'axios';

function prefix() {
	if (window.localStorage.getItem('organizationId') != undefined) {
		return `organization/${window.localStorage.getItem('organizationId')}`;
	}
	else {
		return `organization/0`;
	}
}

export function getProblemSet(Q: string, P: number, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined) {
	req.get(`${prefix()}/problemSet/?pageNum=${P}&Q=${Q}`).then(onSuccess).catch(onError);
}

export function getProblemSetPageCount(onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined) {
	req.get(`${prefix()}/problemSet/pageCount`).then(onSuccess).catch(onError);
}

export function postProblemSet(problem: singleProblem, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined) {
	const data = problem.toJSONString();
	req.post(`${prefix()}/problemSet`, data).then(onSuccess).catch(onError);
}

export function updateProblemSet(problem: singleProblem, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined) {
	const data = problem.toJSONString();
	req.put(`${prefix()}/problemSet/`, data).then(onSuccess).catch(onError);
}

export function updateBatchProblemSet(problems: Array<singleProblem>, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined) {
	let NewData = "[ ";
	problems.forEach(prob => {
		NewData += (prob.toJSONString());
		NewData += "\r\n,";
	});
	NewData = NewData.slice(0, NewData.length - 1);
	NewData += "]";
	if (NewData === "]") { NewData = "[]" }
	let CompleteData = { toBeUpdated: JSON.stringify(JSON.parse(NewData)) };
	req.patch(`${prefix()}/problemSet/`, CompleteData).then(onSuccess).catch(onError);
}

export function deleteProblemSet(problem: singleProblem, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined) {
	const toBeDeletedID = problem.ID;
	req.delete(`${prefix()}/problemSet/${toBeDeletedID}`).then(onSuccess).catch(onError);
}
