import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	JsonObject,
	IRequestOptions,
	IHttpRequestMethods,
	IDataObject,
	INodeExecutionData,
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
	let uri =`https://${region}.craftmypdf.com/v1${endpoint}`;
	let options: IRequestOptions = {
		headers: {
			'user-agent': 'n8n',
			Accept: 'application/json',
		},
		uri: uri,
		method,
		qs,
		body,
		followRedirect: true,
		followAllRedirects: true,
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
		const response = await this.helpers.requestWithAuthentication.call(
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

export function validateJSON(json: string | undefined): any {
	let result;
	try {
		result = JSON.parse(json!);
	} catch (exception) {
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
		useStream: true,
		resolveWithFullResponse: true,
		encoding: null,
		json: false,
	});

	const binaryData = await this.helpers.prepareBinaryData(responseData.body, outputFile);

	return {
		json: {},
		binary: {
			[outputFile]: binaryData,
		},
	};
}
