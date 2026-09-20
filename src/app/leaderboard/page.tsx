import { Metadata } from 'next';
import { getCurrentSession } from '@/lib/auth';
import { getLeaderboard } from '@/services/user-service';
import { Trophy, Medal, Flame, Zap, Crown, Award, Star, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community Leaderboard | WordFlow',
  description: 'See the top English vocabulary learners on WordFlow. Earn XP through daily reviews, multi-mode practice, and masteries.',
};

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage() {
  const session = await getCurrentSession();
  const leaderboard = await getLeaderboard();

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const currentUserRank = session
    ? leaderboard.find((item) => item.id === session.userId)
    : null;

  return (
    <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Global Vocabulary League
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
            Leaderboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
            Compete with learners worldwide. Complete daily SRS reviews, practice quizzes, and learn new CEFR words to earn XP and level up.
          </p>
        </div>

        {/* Current User Quick Floating Banner */}
        {currentUserRank && (
          <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xl backdrop-blur-xs">
                #{currentUserRank.rank}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-primary-200 font-semibold">
                  Your Current Standing
                </div>
                <div className="text-lg font-bold flex items-center gap-2">
                  <span>{currentUserRank.displayName}</span>
                  <span className="text-sm font-normal text-primary-200">Level {currentUserRank.level}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-xs text-primary-200">Total Score</div>
                <div className="text-xl font-black tracking-tight flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  {currentUserRank.xp.toLocaleString()} XP
                </div>
              </div>
              <Link
                href="/learn"
                className="px-4 py-2 bg-white text-primary-700 rounded-xl text-xs font-bold hover:bg-neutral-100 transition shadow-xs"
              >
                Earn More XP
              </Link>
            </div>
          </div>
        )}

        {/* Podium for Top 3 */}
        {top3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 pb-2 items-end">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="order-2 md:order-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center shadow-xs flex flex-col items-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  2
                </div>
                <div className="text-4xl my-2">{top3[1].avatar}</div>
                <div className="font-bold text-neutral-900 dark:text-white truncate max-w-full">
                  {top3[1].displayName}
                </div>
                <div className="text-xs text-neutral-500 mb-3">@{top3[1].username}</div>
                <Badge variant="outline" className="mb-2 text-xs font-semibold">
                  Level {top3[1].level}
                </Badge>
                <div className="text-lg font-black text-neutral-800 dark:text-neutral-100 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {top3[1].xp.toLocaleString()} XP
                </div>
              </div>
            )}

            {/* 1st Place - Champion */}
            {top3[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 to-white dark:to-neutral-900 border-2 border-amber-400 dark:border-amber-500/60 rounded-3xl p-7 text-center shadow-lg flex flex-col items-center relative md:-translate-y-2">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-500 text-amber-950 font-black flex items-center justify-center text-base shadow-md">
                  <Crown className="w-5 h-5 fill-amber-950" />
                </div>
                <div className="text-5xl my-2">{top3[0].avatar}</div>
                <div className="font-black text-lg text-neutral-900 dark:text-white truncate max-w-full">
                  {top3[0].displayName}
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mb-3">
                  Grand Champion • @{top3[0].username}
                </div>
                <Badge variant="primary" className="mb-2 text-xs font-bold">
                  Level {top3[0].level}
                </Badge>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  {top3[0].xp.toLocaleString()} XP
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="order-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center shadow-xs flex flex-col items-center relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-700/60 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  3
                </div>
                <div className="text-4xl my-2">{top3[2].avatar}</div>
                <div className="font-bold text-neutral-900 dark:text-white truncate max-w-full">
                  {top3[2].displayName}
                </div>
                <div className="text-xs text-neutral-500 mb-3">@{top3[2].username}</div>
                <Badge variant="outline" className="mb-2 text-xs font-semibold">
                  Level {top3[2].level}
                </Badge>
                <div className="text-lg font-black text-neutral-800 dark:text-neutral-100 flex items-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {top3[2].xp.toLocaleString()} XP
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Rankings Table */}
        <Card className="overflow-hidden shadow-xs border-neutral-200 dark:border-neutral-800">
          <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <h2 className="font-bold text-neutral-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              All Rankings ({leaderboard.length} learners)
            </h2>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Updated in real-time
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4 sm:px-6">Learner</th>
                  <th className="py-3.5 px-4 sm:px-6 text-center">Level</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Total XP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {leaderboard.map((user) => {
                  const isCurrentUser = session?.userId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors ${
                        isCurrentUser
                          ? 'bg-primary-50/60 dark:bg-primary-950/30 font-medium'
                          : ''
                      }`}
                    >
                      <td className="py-4 px-4 sm:px-6 text-center">
                        {user.rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-black text-xs">
                            🥇
                          </span>
                        ) : user.rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-black text-xs">
                            🥈
                          </span>
                        ) : user.rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs">
                            🥉
                          </span>
                        ) : (
                          <span className="font-semibold text-neutral-500 text-sm">
                            #{user.rank}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{user.avatar}</span>
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                              {user.displayName}
                              {isCurrentUser && (
                                <Badge variant="primary" className="text-[10px] py-0 px-1.5">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-neutral-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          Level {user.level}
                        </span>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right font-bold text-neutral-900 dark:text-white">
                        <div className="flex items-center justify-end gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{user.xp.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
