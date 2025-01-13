import { responseGroupConfig } from './responseGroups';

export interface AgentConfig {
    responseGroups?: typeof responseGroupConfig;
}

export const defaultConfig: AgentConfig = {
    responseGroups: responseGroupConfig
};