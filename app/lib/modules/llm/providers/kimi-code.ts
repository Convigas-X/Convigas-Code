import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class KimiCodeProvider extends BaseProvider {
  name = 'KimiCode';
  label = 'Kimi Code';
  getApiKeyLink = 'https://platform.moonshot.ai/console/api-keys';
  labelForGetApiKey = 'Get Kimi API Key';
  icon = 'i-ph:robot';

  config = {
    apiTokenKey: 'KIMI_CODE_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'kimi-k2-5',
      label: 'Kimi k2.5',
      provider: 'KimiCode',
      maxTokenAllowed: 256000,
      maxCompletionTokens: 8192,
    },
    {
      name: 'kimi-k2-thinking',
      label: 'Kimi k2 Thinking',
      provider: 'KimiCode',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 4096,
    },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'KIMI_CODE_API_KEY',
    });

    if (!apiKey) {
      return this.staticModels;
    }

    try {
      const response = await fetch('https://api.moonshot.ai/v1/models', {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        signal: this.createTimeoutSignal(5000),
      });

      if (!response.ok) {
        return this.staticModels;
      }

      const data = (await response.json()) as {
        data: Array<{
          id: string;
          object: string;
          owned_by: string;
          permission: any[];
        }>;
      };

      const models = data.data.map((model) => ({
        name: model.id,
        label: model.id,
        provider: this.name,
        maxTokenAllowed: 256000,
      }));

      return models.length > 0 ? models : this.staticModels;
    } catch {
      return this.staticModels;
    }
  }

  getModelInstance(options: {
    model: string;
    serverEnv: any;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'KIMI_CODE_API_KEY',
    });

    if (!apiKey) {
      throw new Error(
        `Missing API key for ${this.label} provider. Please set KIMI_CODE_API_KEY in your environment variables or settings.`,
      );
    }

    const openai = createOpenAI({
      baseURL: 'https://api.moonshot.ai/v1',
      apiKey,
    });

    return openai(model);
  }
}
