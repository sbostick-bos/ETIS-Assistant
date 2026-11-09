import React from 'react';
import { GidProject } from '../types/gid';
import { GID_STAGES } from '../data/gidKnowledge';
import { BarChart3, PieChart, TrendingUp, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface AnalyticsChartsProps {
  projects: GidProject[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ projects }) => {
  // Department coaching hours data (Upper School)
  const departmentHours = [
    { dept: 'Upper School Science & AP Env', hours: 8.5, color: '#3B82F6' },
    { dept: 'Upper School Humanities & AP Lit', hours: 7.0, color: '#6366F1' },
    { dept: 'Upper School STEM & Bioengineering', hours: 6.5, color: '#10B981' },
    { dept: 'Upper School AP Capstone & Seminar', hours: 5.0, color: '#F59E0B' },
    { dept: 'Upper School World Languages', hours: 3.5, color: '#EC4899' },
    { dept: 'Upper School Visual & Performing Arts', hours: 2.5, color: '#8B5CF6' },
  ];

  const maxDeptHours = Math.max(...departmentHours.map((d) => d.hours));

  // GID stage distribution
  const stageDistribution = GID_STAGES.map((s) => {
    const count = projects.filter((p) => p.currentStage === s.id).length;
    return {
      stage: s.name,
      number: s.stageNumber,
      count,
      color: s.color,
    };
  });

  const maxStageCount = Math.max(...stageDistribution.map((s) => s.count), 1);

  // Time allocation percentages
  const timeAllocations = [
    { category: 'Core GID Scaffolding & Co-Planning', percent: 45, color: '#2563EB', roleClass: 'Core ETIS' },
    { category: 'Faculty AI Literacy Workshops & Demos', percent: 25, color: '#059669', roleClass: 'Core ETIS' },
    { category: 'Digital Curriculum Resource Design', percent: 18, color: '#4F46E5', roleClass: 'Supporting' },
    { category: 'Hardware & Account Support (Leaks)', percent: 12, color: '#E11D48', roleClass: 'Time Leak' },
  ];

  // Weekly trend for the past 4 weeks
  const weeklyTrends = [
    { week: 'Wk 1 (Oct 13)', coachingHrs: 16, aiDemos: 2, leakHrs: 6 },
    { week: 'Wk 2 (Oct 20)', coachingHrs: 21, aiDemos: 3, leakHrs: 5 },
    { week: 'Wk 3 (Oct 27)', coachingHrs: 26, aiDemos: 4, leakHrs: 4 },
    { week: 'Wk 4 (Current)', coachingHrs: 33, aiDemos: 6, leakHrs: 2.5 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Section Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Productivity & Faculty Impact Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Visual telemetry tracking coaching volume, GID stage progression, and ETIS role focus
            </p>
          </div>
          <div className="text-xs font-mono text-slate-500 tabular-nums">
            Term: Fall 2026 · Cycle 2
          </div>
        </div>
      </div>

      {/* Grid of Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Coaching Hours by Academic Department */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Coaching Volume by Academic Department
            </h3>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              33.0 hrs total
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Direct co-planning, classroom observations, and pedagogy sessions
          </p>

          <div className="space-y-3 pt-2">
            {departmentHours.map((dept) => {
              const widthPercent = Math.round((dept.hours / maxDeptHours) * 100);
              return (
                <div key={dept.dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{dept.dept}</span>
                    <span className="font-mono text-slate-500 tabular-nums font-medium">
                      {dept.hours.toFixed(1)} hrs
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: dept.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: GID Stage Distribution of Active Inquiries */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Inquiry Units Across GID 8 Stages
            </h3>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {projects.length} active units
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Monitoring where students are situated along the Guided Inquiry Design arc
          </p>

          <div className="grid grid-cols-8 gap-1.5 items-end h-40 pt-6">
            {stageDistribution.map((item) => {
              const heightPercent = item.count > 0 ? Math.max(25, (item.count / maxStageCount) * 100) : 8;
              return (
                <div key={item.stage} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-mono font-medium text-slate-600 mb-1 tabular-nums">
                    {item.count}
                  </span>
                  <div
                    className="w-full rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: item.color,
                      opacity: item.count > 0 ? 1 : 0.25,
                    }}
                    title={`${item.stage}: ${item.count} project(s)`}
                  />
                  <span className="text-[10px] font-mono text-slate-500 mt-2 truncate max-w-[36px]">
                    0{item.number}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>01: Open → 04: Identify → 08: Evaluate</span>
            <span className="text-indigo-600 font-medium">Stage 5 (Gather) in highest demand</span>
          </div>
        </div>

        {/* Chart 3: Time Allocation & Role Relevancy Split */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Workload Split vs ETIS Role Relevancy
            </h3>
            <span className="text-xs font-mono font-medium text-emerald-600 tabular-nums">
              88% High Alignment
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Tracking instructional impact vs routine administrative and hardware leaks
          </p>

          {/* Stacked bar */}
          <div className="w-full bg-slate-100 h-6 rounded-md overflow-hidden flex">
            {timeAllocations.map((alloc) => (
              <div
                key={alloc.category}
                style={{
                  width: `${alloc.percent}%`,
                  backgroundColor: alloc.color,
                }}
                className="h-full flex items-center justify-center text-[10px] font-mono text-white font-medium"
                title={`${alloc.category}: ${alloc.percent}%`}
              >
                {alloc.percent}%
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-2">
            {timeAllocations.map((alloc) => (
              <div key={alloc.category} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-xs"
                    style={{ backgroundColor: alloc.color }}
                  />
                  <span className="text-slate-700">{alloc.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono tabular-nums">{alloc.percent}%</span>
                  <span className={`text-[10px] font-medium ${
                    alloc.roleClass === 'Time Leak' ? 'text-rose-600' : 'text-slate-400'
                  }`}>
                    ({alloc.roleClass})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Multi-Week Productivity & AI Adoption Velocity */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Monthly Coaching Velocity & Leak Reduction
            </h3>
            <span className="text-xs text-emerald-600 font-mono font-medium tabular-nums">
              +106% Coaching Growth
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Weekly coaching hours increasing while hardware ticket diversions drop
          </p>

          <div className="space-y-3 pt-2">
            {weeklyTrends.map((trend, i) => (
              <div key={trend.week} className="border border-slate-100 p-2.5 rounded-md bg-slate-50/50">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800">{trend.week}</span>
                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="text-indigo-600 font-medium tabular-nums">{trend.coachingHrs} hrs coaching</span>
                    <span className="text-emerald-600 tabular-nums">{trend.aiDemos} AI workshops</span>
                    <span className="text-rose-600 tabular-nums">{trend.leakHrs} hrs leaks</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-indigo-600 h-full"
                    style={{ width: `${(trend.coachingHrs / 35) * 100}%` }}
                  />
                  <div
                    className="bg-rose-400 h-full"
                    style={{ width: `${(trend.leakHrs / 35) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
