import React from 'react';
import { Layers, Users, Compass, Sparkles, TrendingUp } from 'lucide-react';

interface KpiSummaryRowProps {
  activeProjectsCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  roleAlignmentPercent: number;
  coachingHoursThisWeek: number;
}

export const KpiSummaryRow: React.FC<KpiSummaryRowProps> = ({
  activeProjectsCount,
  completedTasksCount,
  totalTasksCount,
  roleAlignmentPercent,
  coachingHoursThisWeek,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* Metric 1: Active GID Projects */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Active Inquiries</span>
          <Layers className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {activeProjectsCount}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span className="font-medium text-indigo-700">Grades 9–12 only</span>
          <span aria-hidden="true">·</span>
          <span>8-stage GID tracked</span>
        </div>
      </div>

      {/* Metric 2: Coaching Hours */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Faculty Coaching</span>
          <Users className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {coachingHoursThisWeek} hrs
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>6 departments reached</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-600 font-medium">+3.5 hrs vs last wk</span>
        </div>
      </div>

      {/* Metric 3: Role Relevancy Alignment */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Role Relevancy</span>
          <Compass className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {roleAlignmentPercent}%
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>Core ETIS focus</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-600">2 tech-support leaks flagged</span>
        </div>
      </div>

      {/* Metric 4: Daily Task Velocity */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Task Velocity</span>
          <TrendingUp className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
          {completedTasksCount} / {totalTasksCount}
        </div>
        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
          <span>{Math.round((completedTasksCount / (totalTasksCount || 1)) * 100)}% complete today</span>
          <span aria-hidden="true">·</span>
          <span>4 high-leverage milestones</span>
        </div>
      </div>

    </div>
  );
};
