export interface Watch {
	t: string;
	v: string;
}

export interface Payload {
	startYear: number;
	endYear: number;
	valueArray: Array<Watch>;
}

export interface WorkerRequest {
	type: string;
	payload: Payload;
}

export interface AverageChunk {
	name: number;
	value: number;
}

export interface BeginResponseData {
	years: Array<string>;
}


export interface AverageResponseData {
	name: string;
	series: Array<AverageChunk>;
}

export interface WorkerResponse {
	type: string;
	data?: any;
}


