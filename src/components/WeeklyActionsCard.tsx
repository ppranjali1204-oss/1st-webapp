import React, { useState } from 'react';
import { ActionItem, Language } from '../types';
import { getTranslation } from '../data/translations';
import {
  CheckCircle2,
  Circle,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Send,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface WeeklyActionsCardProps {
  actions: ActionItem[];
  language: Language;
  onToggleAction: (id: string) => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
  onOpenQuickResponder?: (category: string, initialTemplate?: string) => void;
}

export const WeeklyActionsCard: React.FC<WeeklyActionsCardProps> = ({
  actions,
  language,
  onToggleAction,
  onGenerateAI,
  isGenerating,
  onOpenQuickResponder,
}) => {
  const t = getTranslation(language);
  const [expandedId, setExpandedId] = useState<string | null>(actions[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const completedCount = actions.filter((a) => a.completed).length;
  const allCompleted = completedCount === actions.length && actions.length > 0;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {t.actionsTitle}
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 tabular-nums">
              {completedCount}/{actions.length} {t.actionsProgress}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t.actionsSubtitle}
          </p>
        </div>

        {/* AI refresh action */}
        <button
          onClick={onGenerateAI}
          disabled={isGenerating}
          className="shrink-0 min-h-[38px] px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer active:scale-95"
          title={t.generateWithAI}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">
            {isGenerating ? t.generatingAI : t.generateWithAI}
          </span>
          <span className="sm:hidden font-bold">AI</span>
        </button>
      </div>

      {/* Completion congratulations alert */}
      {allCompleted && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <span>{t.allActionsDone}</span>
        </div>
      )}

      {/* 3 Action Items */}
      <div className="space-y-2.5">
        {actions.map((act, index) => {
          const isDone = !!act.completed;
          const isExpanded = expandedId === act.id;

          return (
            <div
              key={act.id || index}
              className={`rounded-xl border transition-all ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/40 text-slate-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="p-3 sm:p-3.5 flex items-start gap-3">
                {/* Interactive Checkbox Hitbox */}
                <button
                  type="button"
                  onClick={() => onToggleAction(act.id)}
                  className="mt-0.5 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 hover:text-slate-600" />
                  )}
                </button>

                {/* Content */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : act.id)}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold tracking-tight ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {act.title}
                    </span>
                  </div>

                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${
                      isDone ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {act.description}
                  </p>

                  {/* Metadata strip */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {act.estimatedMinutes || 5}m
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <Zap className="w-3 h-3 text-emerald-600" />
                      {act.impact || 'High Impact'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500 hover:text-slate-800 underline underline-offset-2">
                      {isExpanded ? 'Hide template' : 'View ready message'}
                    </span>
                  </div>
                </div>

                {/* Expand Toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : act.id)}
                  className="shrink-0 p-1 text-slate-400 hover:text-slate-700 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Ready-to-copy Action Template drawer */}
              {isExpanded && act.suggestedTemplate && (
                <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5 pt-0 border-t border-slate-100 mt-1">
                  <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3 border border-slate-200/80 mt-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      <span>Ready Template</span>
                      <span className="text-[10px] text-slate-400 normal-case">
                        1-tap copy & send
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed font-mono bg-white p-2 rounded-md border border-slate-200">
                      {act.suggestedTemplate}
                    </p>

                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        onClick={() => handleCopy(act.id, act.suggestedTemplate)}
                        className="min-h-[38px] px-3 py-1.5 rounded-md bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                      >
                        {copiedId === act.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">{t.copiedToast}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>{t.copyText}</span>
                          </>
                        )}
                      </button>

                      {act.category === 'whatsapp' && (
                        <button
                          onClick={() => handleOpenWhatsApp(act.suggestedTemplate)}
                          className="min-h-[38px] px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 ml-auto"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{t.openWhatsApp}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
