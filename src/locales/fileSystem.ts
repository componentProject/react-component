import { TranslationType, MessagesType, SupportedLocales } from './types';
import messages from './messages';
import enUS from './en-US';
import zhCN from './zh-CN';

// API基础URL
const API_BASE_URL = 'http://localhost:3001/api';

// 在内存中缓存数据，提高性能
let cachedMessages: MessagesType | null = null;
let cachedTranslations: Record<SupportedLocales, TranslationType | null> = {
  'zh-CN': null,
  'en-US': null
};

/**
 * 获取翻译消息
 */
export const getMessages = async (): Promise<MessagesType> => {
  try {
    if (cachedMessages) {
      return cachedMessages;
    }

    const response = await fetch(`${API_BASE_URL}/messages`);
    if (!response.ok) {
      throw new Error('获取消息定义失败');
    }
    
    const data = await response.json();
    cachedMessages = data;
    return data;
  } catch (error) {
    console.error('Failed to load messages:', error);
    return messages;
  }
};

/**
 * 获取特定语言的翻译
 */
export const getLocaleMessages = async (locale: SupportedLocales): Promise<TranslationType> => {
  try {
    if (cachedTranslations[locale]) {
      return cachedTranslations[locale]!;
    }

    const response = await fetch(`${API_BASE_URL}/locales/${locale}`);
    if (!response.ok) {
      throw new Error(`获取${locale}翻译失败`);
    }
    
    const data = await response.json();
    cachedTranslations[locale] = data;
    return data;
  } catch (error) {
    console.error(`Failed to load ${locale} translations:`, error);
    return locale === 'zh-CN' ? zhCN : enUS;
  }
};

/**
 * 获取所有支持的语言
 */
export const getSupportedLocales = async (): Promise<SupportedLocales[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locales`);
    if (!response.ok) {
      throw new Error('获取支持的语言列表失败');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to load supported locales:', error);
    return ['zh-CN', 'en-US'];
  }
};

/**
 * 保存翻译文件
 */
export const saveLocaleFile = async (locale: SupportedLocales, data: TranslationType): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locales/${locale}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '保存失败');
    }
    
    cachedTranslations[locale] = data;
    return true;
  } catch (error) {
    console.error(`保存 ${locale} 文件失败:`, error);
    return false;
  }
};

/**
 * 保存消息定义文件
 */
export const saveMessagesFile = async (data: MessagesType): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '保存失败');
    }
    
    cachedMessages = data;
    return true;
  } catch (error) {
    console.error('保存 messages 文件失败:', error);
    return false;
  }
};

/**
 * 批量保存所有翻译文件和消息定义
 * 使用单一API调用减少服务器备份次数
 */
export const batchSaveFiles = async (
  messagesData: MessagesType, 
  translationsData: Record<SupportedLocales, TranslationType>
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/batch-save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messagesData,
        translations: translationsData
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '批量保存失败');
    }
    
    // 更新缓存
    cachedMessages = messagesData;
    Object.keys(translationsData).forEach(lang => {
      cachedTranslations[lang as SupportedLocales] = translationsData[lang as SupportedLocales];
    });
    
    return true;
  } catch (error) {
    console.error('批量保存文件失败:', error);
    return false;
  }
};

/**
 * 清除缓存，强制从服务器重新加载
 */
export const clearCache = (): void => {
  cachedMessages = null;
  cachedTranslations = {
    'zh-CN': null,
    'en-US': null
  };
}; 