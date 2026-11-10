import React, { useEffect, useState } from 'react';
import {
  Crown,
  Trophy,
  Medal,
  Award,
  Crosshair,
  Calendar,
  Sparkles,
  ShieldCheck,
  Search
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { TournamentResult } from '../types';

export const WinnersView: React.FC = () => {
  const [results, setResults] = useState<TournamentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<TournamentResult | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'tournament_results'),
      (snapshot) => {
        const list: TournamentResult[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...(doc.data() as Omit<TournamentResult, 'id'>) });
        });
        list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        setResults(list);
        if (list.length > 0 && !selectedResult) {
          setSelectedResult(list[0]);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching tournament results:', err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const currentResult = selectedResult || results[0];

  return (
    <div className="space-y-6 pb-24 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-2xl font-black font-heading tracking-wide text-white flex items-center space-x-2">
            <span>WINNERS</span>
            <span className="text-amber-500">& LEADERBOARD</span>
          </h2>
          <p className="text-xs text-zinc-400">Verified Free Fire Champions & EasyPaisa Payouts</p>
        </div>

        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
          <Crown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      {/* Tournament Selector Chips if multiple */}
      {results.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {results.map((res) => (
            <button
              key={res.id}
              onClick={() => setSelectedResult(res)}
              className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all border ${
                currentResult?.id === res.id
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-white'
              }`}
            >
              {res.tournamentTitle}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-zinc-400">Loading verified champions...</p>
        </div>
      ) : !currentResult ? (
        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-10 text-center text-zinc-500 text-xs space-y-2">
          <Trophy className="w-8 h-8 mx-auto text-zinc-600" />
          <p>No tournament results announced yet. Complete upcoming matches to be featured!</p>
        </div>
      ) : (
        <>
          {/* Tournament Overview Card */}
          <div className="bg-gradient-to-r from-zinc-900 to-[#181a22] border border-amber-500/30 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              OFFICIAL RESULTS
            </span>
            <h3 className="font-heading font-black text-lg text-white">
              {currentResult.tournamentTitle}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-zinc-400 pt-1">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>{currentResult.matchDate}</span>
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Prizes Distributed via EasyPaisa</span>
              </span>
            </div>
          </div>

          {/* Podium Top 3 */}
          {currentResult.winners && currentResult.winners.length >= 3 && (
            <div className="pt-2">
              <div className="grid grid-cols-3 gap-2 items-end">
                {/* 2nd Place */}
                <div className="bg-gradient-to-t from-zinc-900 to-zinc-800 border border-white/10 rounded-2xl p-3 text-center flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 border-2 border-zinc-400 flex items-center justify-center font-bold text-white text-sm mb-1 shadow-md">
                    2nd
                  </div>
                  <span className="font-bold text-white text-xs truncate max-w-full">
                    {currentResult.winners[1].playerName}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    UID: {currentResult.winners[1].ffUid}
                  </span>
                  <div className="mt-2 py-1 px-2 rounded-lg bg-black/40 border border-white/5 w-full">
                    <span className="text-xs font-black text-zinc-200 block">
                      {currentResult.winners[1].prizeAmount} PKR
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      {currentResult.winners[1].kills} Kills
                    </span>
                  </div>
                </div>

                {/* 1st Place Champion */}
                <div className="bg-gradient-to-t from-[#1f190e] to-amber-950/40 border-2 border-amber-500/60 rounded-2xl p-3 text-center flex flex-col items-center shadow-xl shadow-amber-500/20 transform -translate-y-2">
                  <div className="relative mb-1">
                    <Crown className="w-6 h-6 text-amber-400 absolute -top-5 left-1/2 -translate-x-1/2 animate-bounce" />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 border-2 border-amber-300 flex items-center justify-center font-black text-black text-base shadow-lg">
                      1st
                    </div>
                  </div>
                  <span className="font-heading font-black text-white text-sm truncate max-w-full">
                    {currentResult.winners[0].playerName}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold">
                    UID: {currentResult.winners[0].ffUid}
                  </span>
                  <div className="mt-2 py-1.5 px-2 rounded-xl bg-amber-500/20 border border-amber-500/40 w-full">
                    <span className="text-sm font-black text-amber-400 font-heading block">
                      {currentResult.winners[0].prizeAmount} PKR
                    </span>
                    <span className="text-[10px] font-bold text-amber-200">
                      {currentResult.winners[0].kills} Kills (MVP)
                    </span>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="bg-gradient-to-t from-zinc-900 to-zinc-800 border border-white/10 rounded-2xl p-3 text-center flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-amber-900/60 border-2 border-amber-700 flex items-center justify-center font-bold text-amber-400 text-sm mb-1 shadow-md">
                    3rd
                  </div>
                  <span className="font-bold text-white text-xs truncate max-w-full">
                    {currentResult.winners[2].playerName}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    UID: {currentResult.winners[2].ffUid}
                  </span>
                  <div className="mt-2 py-1 px-2 rounded-lg bg-black/40 border border-white/5 w-full">
                    <span className="text-xs font-black text-zinc-200 block">
                      {currentResult.winners[2].prizeAmount} PKR
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      {currentResult.winners[2].kills} Kills
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table */}
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-heading font-black uppercase text-zinc-300 tracking-wider">
                MATCH LEADERBOARD
              </span>
              <span className="text-[11px] text-zinc-400">Kills & Payouts</span>
            </div>

            <div className="space-y-2">
              {currentResult.winners?.map((w) => (
                <div
                  key={w.position}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/30 border border-white/5 hover:border-amber-500/20 transition-all text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        w.position === 1
                          ? 'bg-amber-500 text-black'
                          : w.position === 2
                          ? 'bg-zinc-300 text-black'
                          : w.position === 3
                          ? 'bg-amber-800 text-white'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {w.position}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{w.playerName}</span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        UID: {w.ffUid} {w.teamName ? `• ${w.teamName}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400 block">
                      {w.prizeAmount} PKR
                    </span>
                    <span className="text-[10px] text-zinc-400 flex items-center justify-end space-x-1">
                      <Crosshair className="w-3 h-3 text-red-500" />
                      <span>{w.kills} Kills</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
