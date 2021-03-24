import req from './req';
import singleProblem from '../components/problem-set/single-problem'
import { AxiosResponse } from 'axios';
import { getCookie } from '../util/get-cookie';
import { string } from 'prop-types';

function prefix(){return `organization/${getCookie('organization-id')}`;}

export function getProblemSet(onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined){
	req.get(`${prefix()}/problemSet`).then(onSuccess).catch(onError);
}

export function postProblemSet(problem:singleProblem, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined){
	const data = problem.toJSONString();
	req.post(`${prefix()}/problemSet`, data).then(onSuccess).catch(onError);
}

export function updateProblemSet(problem:singleProblem, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined){
	const data = problem.toJSONString();
	req.post(`${prefix()}/problemSet/update`, data).then(onSuccess).catch(onError);
}

export function updateBatchProblemSet(problems:Array<singleProblem>, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined){
	let NewData = "[ ";
	problems.forEach(prob => {
		NewData += (prob.toJSONString());
		NewData += "\r\n,";
	});
	NewData = NewData.slice(0, NewData.length - 1);
	NewData += "]";
	if(NewData === "]") {NewData = "[]"}
	let CompleteData = {toBeUpdated:JSON.stringify(JSON.parse(NewData))};
	req.post(`${prefix()}/problemSet/updateBatch`, CompleteData).then(onSuccess).catch(onError);
}

export function deleteProblemSet(problem:singleProblem, onSuccess: ((value: AxiosResponse<any>) => AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) | null | undefined, onError: ((reason: any) => PromiseLike<never>) | null | undefined){
	const toBeDeletedID = problem.ID;
	req.post(`${prefix()}/problemSet/delete`, {ID:toBeDeletedID}).then(onSuccess).catch(onError);
	// req.delete('/problemSet', {data:{ID:toBeDeletedID}}).then(onSuccess).catch(onError);
}