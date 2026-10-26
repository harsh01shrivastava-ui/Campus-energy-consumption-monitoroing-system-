import React from 'react';
import { StudentClassProfile } from '../../types';
import { 
  Trophy, 
  Flame, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Moon, 
  Zap, 
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface ClassScorecardProps {
  profile: StudentClassProfile;
}

export const ClassScorecard: React.FC<ClassScorecardProps> = ({ profile }) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-600" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-600" />;
      case 'Zap': return <Zap className="w-5 h-5 text-teal-600" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Scorecard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Grassroots Cohort
            </span>
            <span className="text-xs text-slate-400">Class Rep Dashboard</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
            {profile.className}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {profile.department} • {profile.section}
          </p>
        </div>

        {/* Global Class Rank Pill */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-black text-sm">
            #{profile.rank}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus Rank</span>
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
              Top 1% Cohort <TrendingUp className="w-3 h-3 text-emerald-600" />
            </span>
          </div>
        </div>
      </div>

      {/* 3 Grassroots Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* Eco Points */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Class Eco-Points</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-emerald-800 font-mono">
              {profile.ecoPoints}
            </span>
            <span className="text-xs font-semibold text-emerald-600">pts</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            +15 pts per verified exit shutdown
          </p>
        </div>

        {/* Streak */}
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Compliant Exit Streak</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-amber-800 font-mono">
              {profile.streakDays}
            </span>
            <span className="text-xs font-semibold text-amber-600">Days</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Zero appliances left on post-lecture
          </p>
        </div>

        {/* Checklists Completed */}
        <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Checklists Logged</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-teal-800 font-mono">
              {profile.checklistsCompleted}
            </span>
            <span className="text-xs font-semibold text-teal-600">walkthroughs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            100% adherence over last 14 days
          </p>
        </div>

      </div>

      {/* Earned Digital Badges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Earned Sustainability Badges ({profile.badges.length})</span>
          </h4>
          <span className="text-[11px] text-emerald-700 font-semibold">Active Tier 1 Class</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {profile.badges.map((badge) => (
            <div
              key={badge.id}
              className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-xs transition-all flex items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs shrink-0">
                {getBadgeIcon(badge.icon)}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">
                  {badge.name}
                </span>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                  {badge.description}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Earned {badge.earnedDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
