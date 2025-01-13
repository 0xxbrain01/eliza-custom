import { ResponseGroup, responseGroupConfig } from './config/responseGroups';

export class MessageProcessor {
    private responseGroups: Map<string, ResponseGroup> = new Map();

    constructor(config: AgentConfig) {
        this.initializeResponseGroups(config.responseGroups || responseGroupConfig);
    }

    private initializeResponseGroups(config: typeof responseGroupConfig) {
        if (!config.enabled) return;

        config.groups.forEach(group => {
            this.responseGroups.set(group.name, group);
        });
    }

    private async processWithResponseGroup(message: Message, group: ResponseGroup) {
        const delay = group.responseDelay || responseGroupConfig.defaultDelay;
        const members = group.members;

        if (group.responseOrder === 'random') {
            members.sort(() => Math.random() - 0.5);
        }

        for (const member of members) {
            if (member === '*' || message.target === member) {
                await new Promise(resolve => setTimeout(resolve, delay));
                // Process message for this member
                await this.processMessageForMember(message, member);
            }
        }
    }

    public async processMessage(message: Message) {
        if (this.responseGroups.size > 0) {
            for (const group of this.responseGroups.values()) {
                await this.processWithResponseGroup(message, group);
            }
        } else {
            // Fallback to normal processing
            await this.normalMessageProcessing(message);
        }
    }
}