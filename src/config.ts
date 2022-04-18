import { MoveAndAttackAI } from '@/ai/AI';

const config: Record<string, unknown> = {
    DEFAULT_MONSTER_AI: MoveAndAttackAI,
};

export class Config {
    public get(configName: string) {
        return config[configName];
    }
}
