import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class KimiCodeProvider extends BaseProvider {
  name = 'KimiCode';
  label = 'Kimi Code';
  getApiKeyLink = 'https://platform.moonshot.cn/console/api-keys';
  labelForGetApiKey = 'Get Moonshot API Key';
  icon = 'i-ph:robot'; // Using robot icon as placeholder

  config = {
    apiTokenKey: 'KIMI_CODE_API_KEY',
    baseUrlKey: 'KIMI_CODE_BASE_URL',
    baseUrl: 'https://api.moonshot.cn/v1',
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
    const { apiKey, baseUrl } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: settings,
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'KIMI_CODE_BASE_URL',
      defaultApiTokenKey: 'KIMI_CODE_API_KEY',
    });

    if (!apiKey) {
      return this.staticModels;
    }

    try {
      const response = await fetch(`${baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
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

    const { apiKey, baseUrl } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: 'KIMI_CODE_BASE_URL',
      defaultApiTokenKey: 'KIMI_CODE_API_KEY',
    });

    if (!apiKey) {
      throw new Error(
        `Missing API key for ${this.label} provider. Please set KIMI_CODE_API_KEY in your environment variables or settings.`,
      );
    }

    const openai = createOpenAI({
      baseURL: baseUrl || 'https://api.moonshot.cn/v1',
      apiKey,
    });

    return openai(model);
  }
}
