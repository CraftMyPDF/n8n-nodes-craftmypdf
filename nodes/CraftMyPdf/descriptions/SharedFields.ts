import type { INodeProperties } from 'n8n-workflow';

export const regionField: INodeProperties = {
    displayName: 'Region',
    name: 'region',
    type: 'options',
    default: 'api',
    description: 'Region of the endpoint',
    required: true,
    options: [
        {
            name: 'Default Endpoint',
            value: 'api',
            description: 'Default endpoint for the API',
        },
        {
            name: 'Endpoint: Australia',
            value: 'api-au',
            description: 'Endpoint for Australia',
        },
        {
            name: 'Endpoint: Europe (Frankfurt)',
            value: 'api-de',
            description: 'Endpoint for Europe (Frankfurt)',
        },	
        {
            name: 'Endpoint: US East (N. Virginia)',
            value: 'api-us',
            description: 'Endpoint for US East (N Virginia)',
        },		
        {
            name: 'Other: Alternative - Europe (Frankfurt)',
            value: 'api-alt-de',
            description: 'Alternative endpoint for Europe (Frankfurt)',
        },	 
        {
            name: 'Other: Alternative - Singapore',
            value: 'api-alt',
            description: 'Alternative endpoint for Australia',
        },               	
        {
            name: 'Other: Alternative - US East (N. Virginia)',
            value: 'api-alt-us',
            description: 'Alternative endpoint for US East (N Virginia)',
        },				
        {
            name: 'Other: Staging',
            value: 'api-staging',
            description: 'Staging endpoint',
        }													
    ],
}
