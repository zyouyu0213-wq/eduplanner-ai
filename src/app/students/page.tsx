'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { PlanStatusBadge } from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { StudentStorage, PlanStorage } from '@/lib/storage';
import { formatDate, getPlanStepUrl, getGradeLabel, getCurriculumLabel } from '@/lib/utils';
import type { Student, Plan } from '@/types';

interface Row {
  student: Student;
  latestPlan: Plan | null;
}

export default function StudentsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [search, setSearch] = useState('');

  const load = () => {
    const students = StudentStorage.getAll();
    const plans = PlanStorage.getAll();
    const data: Row[] = students.map(s => {
      const studentPlans = plans.filter(p => p.studentId === s.id)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      return { student: s, latestPlan: studentPlans[0] || null };
    }).sort((a, b) => new Date(b.student.updatedAt).getTime() - new Date(a.student.updatedAt).getTime());
    setRows(data);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (studentId: string) => {
    if (!confirm('确定删除该学生及其所有方案？此操作不可撤销。')) return;
    StudentStorage.delete(studentId);
    load();
  };

  const filtered = rows.filter(({ student }) =>
    student.chineseName.includes(search) ||
    student.englishName.toLowerCase().includes(search.toLowerCase()) ||
    student.school.includes(search) ||
    student.majors.some(m => m.includes(search))
  );

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">学生列表</h1>
          <p className="text-gray-500 text-sm mt-1">共 {rows.length} 位学生</p>
        </div>
        <Link href="/new-plan">
          <Button><Plus size={16} /> 新建方案</Button>
        </Link>
      </div>

      <div className="max-w-sm mb-5">
        <Input
          placeholder="搜索姓名、学校、专业…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">{search ? '没有匹配的学生' : '还没有学生，点击「新建方案」开始'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">学生</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">年级 / 学校</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">专业方向</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">方案状态</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">更新时间</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ student, latestPlan }) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{student.chineseName}</div>
                    <div className="text-xs text-gray-500">{student.englishName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-700">{getGradeLabel(student.grade)}</div>
                    <div className="text-xs text-gray-500">{student.school} · {getCurriculumLabel(student.curriculum)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {student.majors.filter(Boolean).map(m => (
                        <span key={m} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{m}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {latestPlan ? <PlanStatusBadge status={latestPlan.status} /> : <span className="text-xs text-gray-400">无方案</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{formatDate(student.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {latestPlan && (
                        <Link href={getPlanStepUrl(latestPlan)}>
                          <button className="text-accent hover:text-accent-hover p-1.5 rounded-lg hover:bg-amber-50 transition-colors">
                            <ExternalLink size={14} />
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
