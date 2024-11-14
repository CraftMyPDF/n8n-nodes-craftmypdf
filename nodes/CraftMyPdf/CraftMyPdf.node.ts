import {
	type IDataObject,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { accountOperations } from './descriptions/AccountDescription';
import { imageFields, imageOperations } from './descriptions/ImageDescription';
import { pdfFields, pdfOperations } from './descriptions/PdfDescription';
import { transactionFields, transactionOperations } from './descriptions/TransactionDescription';
import { craftMyPdfApiRequest, returnFileExportType, validateJSON } from './GenericFunctions';
import { regionField } from './descriptions/SharedFields';

export class CraftMyPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CraftMyPdf',
		name: 'craftMyPdf',
		icon: 'file:craftMyPdf.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] + ": " + $parameter["resource"] }}',
		description: 'Consume the CraftMyPDF API',
		defaults: {
			name: 'CraftMyPDF',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'craftMyPdfApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'PDF',
						value: 'pdf',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
				],
				default: 'account',
			},
			regionField,

			...accountOperations,

			...imageOperations,
			...imageFields,

			...pdfOperations,
			...pdfFields,

			...transactionOperations,
			...transactionFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][] | null> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < length; i++) {
			try {
				let region = this.getNodeParameter('region', i) as string;
				if (!region) region = 'api';

				if (resource === 'account') {
					if (operation === 'get') {
						// Account Management API: Get account info
						// https://craftmypdf.com/docs/index.html#tag/Account-Management-API/operation/get-account-info
						responseData = await craftMyPdfApiRequest.call(
							this,
							'GET',
							region,
							'/get-account-info',
						);

						returnData.push(responseData as INodeExecutionData);
					}
				}
				if (resource === 'image') {
					if (operation === 'create') {
						// Image Generation API: Create an image
						// https://craftmypdf.com/docs/index.html#tag/Image-Generation-API/operation/create-image
						const data = validateJSON(this.getNodeParameter('data', i) as string);
						if (data === undefined) {
							throw new NodeOperationError(this.getNode(), 'Data: Invalid JSON', {
								itemIndex: i,
							});
						}
						const export_type = this.getNodeParameter('export_type', i) as string;
						const output_file = this.getNodeParameter('output_file', i) as string;

						const body = {
							template_id: this.getNodeParameter('templateId', i) as string,
							data,
							version: this.getNodeParameter('version', i) as string,
							export_type,
							expiration: this.getNodeParameter('expiration', i) as string,
							output_file,
							output_type: this.getNodeParameter('output_type', i) as string,
						};

						if (export_type === 'json') {
							responseData = await craftMyPdfApiRequest.call(
								this,
								'POST',
								region,
								'/create-image',
								{},
								body,
							);
							returnData.push(responseData as INodeExecutionData);
						}
						if (export_type === 'file') {
							const binaryData = await returnFileExportType.call(
								this,
								'POST',
								region,
								'/create-image',
								output_file,
								body,
							);
							returnData.push(binaryData);
						}
					}
				}
				if (resource === 'pdf') {
					if (operation === 'create') {
						// PDF Generation API: Create a PDF
						// https://craftmypdf.com/docs/index.html#tag/PDF-Generation-API/operation/create
						const data = validateJSON(this.getNodeParameter('data', i) as string);
						if (data === undefined) {
							throw new NodeOperationError(this.getNode(), 'Data: Invalid JSON', {
								itemIndex: i,
							});
						}
						const export_type = this.getNodeParameter('export_type', i) as string;
						const output_file = this.getNodeParameter('output_file', i) as string;
						const password_protected = this.getNodeParameter('password_protected', i) as boolean;
						const resize_images = this.getNodeParameter('resize_images', i) as boolean;

						const body: IDataObject = {
							template_id: this.getNodeParameter('templateId', i) as string,
							data,
							version: this.getNodeParameter('version', i) as string,
							export_type,
							expiration: this.getNodeParameter('expiration', i) as string,
							output_file,
							password_protected,
							image_resample_res: this.getNodeParameter('image_resample_res', i) as string,
							resize_images,
						};
						if (password_protected) {
							body.password = this.getNodeParameter('password', i) as string;
						}
						if (resize_images) {
							body.resize_max_width = this.getNodeParameter('resize_max_width', i) as string;
							body.resize_max_height = this.getNodeParameter('resize_max_height', i) as string;
							body.resize_format = this.getNodeParameter('resize_format', i) as string;
						}

						if (export_type === 'json') {
							responseData = await craftMyPdfApiRequest.call(
								this,
								'POST',
								region,
								'/create',
								{},
								body,
							);
							returnData.push(responseData as INodeExecutionData);
						}
						if (export_type === 'file') {
							const binaryData = await returnFileExportType.call(
								this,
								'POST',
								region,
								'/create',
								output_file,
								body,
							);
							returnData.push(binaryData);
						}
					}
					if (operation === 'createAsync') {
						// PDF Generation API: Create a PDF asynchronously
						// https://craftmypdf.com/docs/index.html#tag/PDF-Generation-API/operation/create-async
						const data = validateJSON(this.getNodeParameter('data', i) as string);
						if (data === undefined) {
							throw new NodeOperationError(this.getNode(), 'Data: Invalid JSON', {
								itemIndex: i,
							});
						}
						const resize_images = this.getNodeParameter('resize_images', i) as boolean;

						const body: IDataObject = {
							template_id: this.getNodeParameter('templateId', i) as string,
							data,
							version: this.getNodeParameter('version', i) as string,
							expiration: this.getNodeParameter('expiration', i) as string,
							webhook_url: this.getNodeParameter('webhook_url', i) as string,
							image_resample_res: this.getNodeParameter('image_resample_res', i) as string,
							resize_images,
						};
						if (resize_images) {
							body.resize_max_width = this.getNodeParameter('resize_max_width', i) as string;
							body.resize_max_height = this.getNodeParameter('resize_max_height', i) as string;
							body.resize_format = this.getNodeParameter('resize_format', i) as string;
						}

						responseData = await craftMyPdfApiRequest.call(
							this,
							'POST',
							region,
							'/create-async',
							{},
							body,
						);
						returnData.push(responseData as INodeExecutionData);
					}
					if (operation === 'merge') {
						// PDF Manipulation API: Merge PDF URLs
						// https://craftmypdf.com/docs/index.html#tag/PDF-Manipulation-API/operation/merge-pdfs
						const urls = this.getNodeParameter('urls', i) as IDataObject[];

						const body: IDataObject = {
							urls: urls.map((data) => data.url),
							expiration: this.getNodeParameter('expiration', i) as string,
							output_file: this.getNodeParameter('output_file', i) as string,
						};

						responseData = await craftMyPdfApiRequest.call(
							this,
							'POST',
							region,
							'/merge-pdfs',
							{},
							body,
						);
						returnData.push(responseData as INodeExecutionData);
					}
					if (operation === 'addWatermark') {
						// PDF Manipulation API: Add watermark to a PDF
						// https://craftmypdf.com/docs/index.html#tag/PDF-Manipulation-API/operation/add-watermark
						const body: IDataObject = {
							url: this.getNodeParameter('url', i) as string,
							text: this.getNodeParameter('text', i) as string,
							font_size: this.getNodeParameter('font_size', i) as string,
							opacity: this.getNodeParameter('opacity', i) as string,
							rotation: this.getNodeParameter('rotation', i) as string,
							hex_color: this.getNodeParameter('hex_color', i) as string,
							font_family: this.getNodeParameter('font_family', i) as string,
							expiration: this.getNodeParameter('expiration', i) as string,
							output_file: this.getNodeParameter('output_file', i) as string,
						};

						responseData = await craftMyPdfApiRequest.call(
							this,
							'POST',
							region,
							'/add-watermark',
							{},
							body,
						);
						returnData.push(responseData as INodeExecutionData);
					}
				}
				if (resource === 'transaction') {
					if (operation === 'list') {
						// Account Management API: List transactions
						// https://craftmypdf.com/docs/index.html#tag/Account-Management-API/operation/list-transactions
						const qs: IDataObject = {
							limit: this.getNodeParameter('limit', i),
							offset: this.getNodeParameter('offset', i),
						};

						responseData = await craftMyPdfApiRequest.call(
							this,
							'GET',
							region,
							'/list-transactions',
							qs,
						);

						returnData.push(responseData as INodeExecutionData);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error.message, json: {} });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
