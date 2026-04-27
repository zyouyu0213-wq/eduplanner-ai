'use client';

import type { SummerSchool } from '@/types';
import { X, ExternalLink, Clock, DollarSign, Calendar, GraduationCap } from 'lucide-react';

interface SummerSchoolDrawerProps {
  school: SummerSchool | null;
  onClose: () => void;
}

export default function SummerSchoolDrawer({ school, onClose }: SummerSchoolDrawerProps) {
  if (!school) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap size={16} className="text-accent" />
              <span className="text-xs font-medium text-accent uppercase tracking-wide">夏校推荐</span>
            </div>
            <h2 className="font-bold text-gray-900 text-lg leading-snug">{school.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{school.university}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3">
            {school.duration && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Clock size={12} />
                  项目时长
                </div>
                <div className="text-sm font-medium text-gray-800">{school.duration}</div>
              </div>
            )}
            {school.cost && (
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <DollarSign size={12} />
                  项目费用
                </div>
                <div className="text-sm font-medium text-gray-800">{school.cost}</div>
              </div>
            )}
            {school.deadline && (
              <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <Calendar size={12} />
                  申请截止
                </div>
                <div className="text-sm font-medium text-gray-800">{school.deadline}</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">项目介绍</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{school.description}</p>
          </div>

          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-700">
              ⚠️ 请顾问在向学生推荐前验证夏校是否仍在运行，确认截止日期和费用信息是否为最新版本。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100">
          <a
            href={school.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
            访问官网
          </a>
        </div>
      </div>
    </>
  );
}
