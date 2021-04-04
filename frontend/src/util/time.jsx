function addZero(t){
	return t<10 ? `0${t}` : t;
}

function year(time){
	return time.getFullYear();
}

function month(time){
	return addZero(time.getMonth()+1);
}

function date(time){
	return addZero(time.getDate());
}

function hour(time){
	return addZero(time.getHours());
}

function minute(time){
	return addZero(time.getMinutes());
}

export function toLocalTimeISOString(time){
	time = new Date(time);
	return `${year(time)}-${month(time)}-${date(time)}T${hour(time)}:${minute(time)}`;
}

export function toLocalTimeString(time){
	time = new Date(time);
	return `${year(time)}-${month(time)}-${date(time)} ${hour(time)}:${minute(time)}`;
}