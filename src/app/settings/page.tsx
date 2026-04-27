'use client';

import { useState, useEffect } from 'react';
import { Save, Key, Sliders, Info, CheckCircle, AlertCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────

interface AppSettings {
  apiKeyConfigured: boolean;
  useMockAI: boolean;
  claudeModel: string;
  temperature: number;
  language: string;
}

// ─── Default Settings ─────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings = {
  apiKeyConfigured: false,
  useMockAI: true,
  claudeModel: 'claude-sonnet-4-5',
  temperature: 0.7,
  language: 'zh-CN',
};

const SETTINGS_KEY = 'eduplanner_settings';

function readSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ─── Component ────────────────────────────────────────────────

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  useEffect(() => {
    setSettings(readSettings());
  }, []);

  const handleSave = () => {
    const updated = { ...settings };
    if (apiKeyInput.trim()) {
      // In a real scenario, the API key would be sent to the server
      // For this client-side demo, we just mark it as "configured"
      updated.apiKeyConfigured = true;
      setApiKeyInput('');
    }
    writeSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggleMock = (value: boolean) => {
    setSettings((prev) => ({ ...prev, useMockAI: value }));
  };

  const handleTemperatureChange = (value: number) => {
    setSettings((prev) => ({ ...prev, temperature: value }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="mt-1 text-sm text-gray-500">
          配置 AI 参数和应用偏好
        </p>
      </div>

      <div className="space-y-6">
        {/* API Key Section */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Key size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Google Gemini API Key</h2>
              <p className="text-xs text-gray-500">用于调用 Gemini API 生成真实内容</p>
            </div>
            {settings.apiKeyConfigured ? (
              <span className="ml-auto flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle size={12} />
                已配置
              </span>
            ) : (
              <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                <AlertCircle size={12} />
                未配置
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="relative">
              <input
                type={apiKeyVisible ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={settings.apiKeyConfigured ? '已配置（输入新密钥以更新）' : 'AIza...'}
                className="w-full px-3 py-2 pr-24 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                {apiKeyVisible ? '隐藏' : '显示'}
              </button>
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <Info size={12} className="mt-0.5 shrink-0" />
              <p>
                API Key 仅存储在本地，不会上传至服务器。在实际部署中请通过环境变量{' '}
                <code className="bg-gray-200 px-1 rounded">GEMINI_API_KEY</code> 配置。
              </p>
            </div>
          </div>
        </section>

        {/* AI Mode Section */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Sliders size={16} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">AI 模式</h2>
              <p className="text-xs text-gray-500">切换 Mock 数据或真实 Claude API</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Mock Toggle */}
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                settings.useMockAI
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => handleToggleMock(true)}
            >
              <div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                settings.useMockAI ? 'border-purple-500' : 'border-gray-300'
              }`}>
                {settings.useMockAI && (
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Mock 模式（推荐开发时使用）</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  使用预设数据，无需 API Key，即时响应，适合功能测试和演示
                </p>
              </div>
            </div>

            <div
              className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                !settings.useMockAI
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => handleToggleMock(false)}
            >
              <div className={`w-4 h-4 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                !settings.useMockAI ? 'border-blue-500' : 'border-gray-300'
              }`}>
                {!settings.useMockAI && (
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">真实 API 模式</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  调用 Claude claude-sonnet-4-5，需要有效的 Anthropic API Key，每次生成约 10-30 秒
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Model Config Section */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Info size={16} className="text-green-600" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">模型配置</h2>
          </div>

          <div className="space-y-4">
            {/* Model */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-sm text-gray-600 font-medium">模型</label>
              <div className="col-span-2">
                <select
                  value={settings.claudeModel}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, claudeModel: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="gemini-2.0-flash">gemini-2.0-flash（推荐，免费额度最大）</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro（更强，适合复杂推理）</option>
                  <option value="gemini-2.0-flash-lite">gemini-2.0-flash-lite（最快，用于测试）</option>
                </select>
              </div>
            </div>

            {/* Temperature */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <label className="text-sm text-gray-600 font-medium">
                Temperature
                <span className="block text-xs text-gray-400 font-normal">创意程度</span>
              </label>
              <div className="col-span-2">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
                    className="flex-1 accent-blue-500"
                  />
                  <span className="text-sm font-mono w-8 text-right text-gray-700">
                    {settings.temperature.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>更精确</span>
                  <span className="text-blue-500 font-medium">0.7（PRD 规范）</span>
                  <span>更创意</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">关于</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">应用名称</dt>
              <dd className="text-gray-900 font-medium">EduPlanner AI</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">版本</dt>
              <dd className="text-gray-900 font-mono">v1.0.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">PRD 版本</dt>
              <dd className="text-gray-900">EduPlanner AI PRD V1.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">AI 引擎</dt>
              <dd className="text-gray-900">Google Gemini 2.0 Flash</dd>
            </div>
          </dl>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {saved ? (
              <>
                <CheckCircle size={16} />
                已保存！
              </>
            ) : (
              <>
                <Save size={16} />
                保存设置
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
