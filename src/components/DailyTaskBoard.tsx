import React, { useState } from 'react';
import { DailyTask, TaskCategory } from '../types/gid';
import { getStageById } from '../data/gidKnowledge';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Clock, 
  AlertCircle, 
  Filter, 
  Trash2, 
  Tag, 
  Sparkles 
} from 'lucide-react';

interface DailyTaskBoardProps {
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: DailyTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export const DailyTaskBoard: React.FC<DailyTaskBoardProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRelevance, setFilterRelevance] = useState<string>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('gid_scaffold');
  const [priority, setPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [notes, setNotes] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterRelevance !== 'all' && t.relevanceLabel !== filterRelevance) return false;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalMinutes = tasks.filter((t) => !t.completed).reduce((acc, t) => acc + t.estimatedMinutes, 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let roleRelevanceScore = 90;
    let relevanceLabel: 'Core ETIS' | 'Supporting' | 'Time Leak' = 'Core ETIS';

    if (category === 'tech_support') {
      roleRelevanceScore = 20;
      relevanceLabel = 'Time Leak';
    } else if (category === 'admin') {
      roleRelevanceScore = 60;
      relevanceLabel = 'Supporting';
    }

    const newTask: DailyTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      category,
      priority,
      estimatedMinutes,
      completed: false,
      roleRelevanceScore,
      relevanceLabel,
      notes: notes.trim(),
      dueDate: 'Today',
    };

    onAddTask(newTask);
    setIsAddingTask(false);
    setTitle('');
    setNotes('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
      
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">
              Daily Action Queue & Time Boxing
            </h3>
            <span className="text-xs font-mono font-medium text-slate-500 tabular-nums">
              ({completedCount}/{tasks.length} done)
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Prioritized by GID scaffolding impact and ETIS role relevance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded font-mono tabular-nums">
            <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
            {totalMinutes} mins remaining
          </div>
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Segmented Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Category filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-md">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 font-medium rounded transition-colors ${
              filterCategory === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Work
          </button>
          <button
            onClick={() => setFilterCategory('gid_scaffold')}
            className={`px-2.5 py-1 font-medium rounded transition-colors ${
              filterCategory === 'gid_scaffold' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GID Scaffolding
          </button>
          <button
            onClick={() => setFilterCategory('ai_literacy')}
            className={`px-2.5 py-1 font-medium rounded transition-colors ${
              filterCategory === 'ai_literacy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            AI Literacy
          </button>
          <button
            onClick={() => setFilterCategory('faculty_coaching')}
            className={`px-2.5 py-1 font-medium rounded transition-colors ${
              filterCategory === 'faculty_coaching' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Coaching
          </button>
          <button
            onClick={() => setFilterCategory('tech_support')}
            className={`px-2.5 py-1 font-medium rounded transition-colors ${
              filterCategory === 'tech_support' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tech Support
          </button>
        </div>

        {/* Role Relevancy Filter */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span className="text-[11px]">Role filter:</span>
          <select
            value={filterRelevance}
            onChange={(e) => setFilterRelevance(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none"
          >
            <option value="all">All Relevancy</option>
            <option value="Core ETIS">Core ETIS Only</option>
            <option value="Supporting">Supporting Duties</option>
            <option value="Time Leak">Time Leaks (Flagged)</option>
          </select>
        </div>
      </div>

      {/* Task Creation Modal / Form */}
      {isAddingTask && (
        <form onSubmit={handleCreateSubmit} className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-800">Add New Daily Task</h4>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Co-design GID Stage 4 driving question prompt with Ms. Alvarez"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full text-xs px-2 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
              >
                <option value="gid_scaffold">GID Scaffolding</option>
                <option value="ai_literacy">Faculty AI Literacy</option>
                <option value="faculty_coaching">Faculty Coaching</option>
                <option value="tech_support">Tech Support (Triage)</option>
                <option value="admin">Administrative</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full text-xs px-2 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Est. Minutes</label>
              <input
                type="number"
                min="5"
                max="240"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 15)}
                className="w-full text-xs px-2 py-1.5 bg-white border border-slate-300 rounded focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Save Task
            </button>
          </div>
        </form>
      )}

      {/* Task List Table */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-md overflow-hidden">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => {
            const isLeak = task.relevanceLabel === 'Time Leak';
            const isCore = task.relevanceLabel === 'Core ETIS';

            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 transition-colors ${
                  task.completed 
                    ? 'bg-slate-50/70 opacity-70' 
                    : isLeak 
                    ? 'bg-rose-50/30 hover:bg-rose-50/50' 
                    : 'hover:bg-slate-50/60'
                }`}
              >
                {/* Complete checkbox button */}
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-indigo-600 focus:outline-none shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 fill-indigo-600 text-white" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 hover:text-slate-400" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs font-medium ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0 tabular-nums">
                      {task.estimatedMinutes}m
                    </span>
                  </div>

                  {/* Clean unboxed metadata with separators */}
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-1">
                    <span className="capitalize">{task.category.replace('_', ' ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-medium ${
                      task.priority === 'urgent' ? 'text-rose-600' :
                      task.priority === 'high' ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={`font-medium ${
                      isCore ? 'text-emerald-700' :
                      isLeak ? 'text-rose-600' : 'text-slate-600'
                    }`}>
                      {task.relevanceLabel}
                    </span>
                    {task.gidStage && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-indigo-600 font-mono">
                          GID {getStageById(task.gidStage).name}
                        </span>
                      </>
                    )}
                    {task.dueDate && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-400">{task.dueDate}</span>
                      </>
                    )}
                  </div>

                  {task.notes && (
                    <p className="text-[11px] text-slate-600 mt-1 bg-white/70 p-1.5 rounded border border-slate-100">
                      {task.notes}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <button
                  onClick={() => onDeleteTask(task.id)}
                  title="Remove task"
                  className="text-slate-300 hover:text-rose-600 p-1 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No tasks match the selected filters.
          </div>
        )}
      </div>

    </div>
  );
};
