import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function craftMyPdfApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	region: string,
	endpoint: string,
	qs = {},
	body = {},
	option: IDataObject = {},
) {
	let options: IHttpRequestOptions = {
		url: `https://${region}.craftmypdf.com/v1${endpoint}`,
		headers: {
			'user-agent': 'n8n',
			Accept: 'application/json',
		},
		method,
		qs,
		body,
		json: true,
	};

	if (Object.keys(option).length !== 0) {
		options = Object.assign({}, options, option);
	}

	if (!Object.keys(body).length) {
		delete options.body;
	}

	if (!Object.keys(qs).length) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'craftMyPdfApi',
			options,
		);
		if (response.status === 'error') {
			throw new NodeApiError(this.getNode(), response.message as JsonObject);
		}
		return response;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export function validateJSON(json: string | undefined): unknown {
	let result;
	try {
		result = JSON.parse(json!);
	} catch {
		result = undefined;
	}
	return result;
}

export async function returnFileExportType(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	region: string,
	endpoint: string,
	outputFile: string,
	body = {},
): Promise<INodeExecutionData> {
	const responseData = await craftMyPdfApiRequest.call(this, method, region, endpoint, {}, body, {
		encoding: 'arraybuffer',
		json: false,
	});

	const binaryData = await this.helpers.prepareBinaryData(responseData, outputFile);

	return {
		json: {},
		binary: {
			[outputFile]: binaryData,
		},
	};
}
