export interface ResponseGroup {
    name: string;
    description: string;
    members: string[];
    responseDelay?: number;
    responseOrder?: 'sequential' | 'random';
}

export const defaultResponseGroups: ResponseGroup[] = [
    {
        name: 'default',
        description: 'Default response group for all bots',
        members: ['*'],
        responseDelay: 1000,
        responseOrder: 'sequential'
    }
];

export const responseGroupConfig = {
    enabled: true,
    groups: defaultResponseGroups,
    defaultDelay: 1000
};