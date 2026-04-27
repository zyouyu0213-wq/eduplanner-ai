'use client';

import { useState, useCallback } from 'react';
import type { TimelineEntry } from '@/types';
import { cn } from '@/lib/utils';

interface TimelineTableProps {
  entries: TimelineEntry[];
  onUpdate: (entries: TimelineEntry[]) => void;
  readOnly?: boolean;
}

type ColumnKey = keyof Omit<TimelineEntry, 'grade' | 'month'>;

const COLUMNS: { key: ColumnKey; label: string }[] = [
  { key: 'academic', label: '学术成绩' },
  { key: 'schoolActivities', label: '校内活动' },
  { key: 'competitions', label: '竞赛比赛' },
  { key: 'research', label: '教授科研' },
  { key: 'extracurricular', label: '校外实践' },
  { key: 'applicationPrep', label: '申请准备' },
];

function EditableCell({
  value,
  onChange,
  readOnly,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value);

  const handleBlur = useCallback(() => {
    onChange(localVal);
    setEditing(false);
  }, [localVal, onChange]);

  if (readOnly) {
    return (
      <td className="px-3 py-2 text-xs text-gray-600 align-top min-w-[130px] border border-gray-200">
        <span className={cn(!value && 'text-gray-300 italic')}>
          {value || '—'}
        </span>
      </td>
    );
  }

  if (editing) {
    return (
      <td className="px-2 py-1 align-top min-w-[130px] border border-accent/40">
        <textarea
          autoFocus
          value={localVal}
          onChange={e => setLocalVal(e.target.value)}
          onBlur={handleBlur}
          rows={3}
          className="w-full text-xs p-1 border-0 outline-none resize-none bg-amber-50 rounded"
        />
      </td>
    );
  }

  return (
    <td
      onClick={() => { setLocalVal(value); setEditing(true); }}
      className={cn(
        'px-3 py-2 text-xs text-gray-600 align-top min-w-[130px] border border-gray-200',
        'cursor-pointer hover:bg-amber-50/60 transition-colors'
      )}
    >
      <span className={cn(!value && 'text-gray-300 italic')}>
        {value || '点击编辑'}
      </span>
    </td>
  );
}

export default function TimelineTable({ entries, onUpdate, readOnly }: TimelineTableProps) {
  // Group by grade
  const grades = Array.from(new Set(entries.map(e => e.grade)));

  const handleCellChange = (entryIdx: number, col: ColumnKey, val: string) => {
    const updated = entries.map((e, i) => i === entryIdx ? { ...e, [col]: val } : e);
    onUpdate(updated);
  };

  return (
    <div className="overflow-x-auto timeline-scroll rounded-lg border border-gray-200 shadow-sm">
      <table className="border-collapse text-sm" style={{ minWidth: '1100px' }}>
        <thead>
          <tr className="bg-gray-50">
            <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 border border-gray-200 text-left w-[80px]">
              年级
            </th>
            <th className="sticky left-[80px] z-10 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600 border border-gray-200 text-left w-[60px]">
              月份
            </th>
            {COLUMNS.map(col => (
              <th key={col.key} className="px-3 py-3 text-xs font-semibold text-gray-600 border border-gray-200 text-left min-w-[130px]">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grades.map(grade => {
            const gradeEntries = entries.filter(e => e.grade === grade);
            return gradeEntries.map((entry, entryInGrade) => {
              const globalIdx = entries.indexOf(entry);
              return (
                <tr key={`${grade}-${entry.month}`} className="hover:bg-gray-50/50">
                  {entryInGrade === 0 && (
                    <td
                      rowSpan={gradeEntries.length}
                      className="sticky left-0 z-10 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 border border-gray-200 text-center align-middle"
                    >
                      {grade}
                    </td>
                  )}
                  <td className="sticky left-[80px] z-10 bg-white px-3 py-2 text-xs text-gray-600 border border-gray-200 font-medium">
                    {entry.month}
                  </td>
                  {COLUMNS.map(col => (
                    <EditableCell
                      key={col.key}
                      value={entry[col.key]}
                      onChange={val => handleCellChange(globalIdx, col.key, val)}
                      readOnly={readOnly}
                    />
                  ))}
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
}
