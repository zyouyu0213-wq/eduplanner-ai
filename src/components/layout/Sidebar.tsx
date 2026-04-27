'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  Users,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: '工作台', href: '/' },
  { icon: PlusCircle, label: '新建方案', href: '/new-plan' },
  { icon: Users, label: '学生列表', href: '/students' },
  { icon: BookOpen, label: '夏校数据库', href: '/summer-schools' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-[220px] min-h-screen bg-sidebar flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">EduPlanner</div>
            <div className="text-white/40 text-xs">AI Powered</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                active
                  ? 'bg-accent/20 text-amber-400 font-medium'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              )}
              style={
                !active ? {} : {}
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <div className="text-white/40 text-xs">当前版本</div>
          <div className="text-white/80 text-sm font-medium">V1.0 MVP</div>
        </div>
      </div>
    </aside>
  );
}
