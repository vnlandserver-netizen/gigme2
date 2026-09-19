import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Filter,
  Users,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useGigMe } from '../context/GigMeContext';
import { formatVnd, CampusLeaderboardEntry } from '../types';

// Dữ liệu bảng xếp hạng: Bắt đầu từ 0 và tổng hợp 100% từ việc làm thật đã hoàn thành của sinh viên
const INITIAL_CAMPUS_LEADERBOARD: CampusLeaderboardEntry[] = [];

export const CampusLeaderboardScreen: React.FC<{
  onSelectFreelancer?: (name: string) => void;
  onBack?: () => void;
}> = ({ onSelectFreelancer, onBack }) => {
  const { users } = useGigMe();
  const [selectedCampus, setSelectedCampus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const CAMPUS_OPTIONS = [
    { id: 'ALL', name: 'Tất cả Campus TP.HCM & Hà Nội' },
    { id: 'TDTU', name: 'ĐH Tôn Đức Thắng (TDTU)' },
    { id: 'HCMUT', name: 'ĐH Bách Khoa (HCMUT)' },
    { id: 'UEH', name: 'ĐH Kinh Tế TP.HCM (UEH)' },
    { id: 'UIT', name: 'ĐH Công Nghệ Thông Tin (UIT)' },
  ];

  const realLeaderboard: CampusLeaderboardEntry[] = React.useMemo(() => {
    // Chỉ xếp hạng các tài khoản thật đã hoàn thành việc làm trên hệ thống
    const qualified = users
      .filter((u) => u.role !== 'ADMIN' && u.completedGigs > 0)
      .sort((a, b) => b.completedGigs - a.completedGigs || (b.trustScore || 0) - (a.trustScore || 0));

    return qualified.map((u, idx) => ({
      rank: idx + 1,
      userId: u.id,
      name: u.name,
      school: u.studentSchool || 'Đại học tại TP.HCM',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${u.id}`,
      completedGigs: u.completedGigs,
      trustScore: u.trustScore || 720,
      rating: u.rating || 5.0,
      onTimeRate: u.onTimeRate || 100,
      totalEarned: u.walletBalance || 0,
      specialBadge: u.badges || 'Thành viên mới',
      recentGigTitle: 'Nhiệm vụ sinh viên hoàn thành',
    }));
  }, [users]);

  const filteredLeaders = realLeaderboard.filter((entry) => {
    const matchCampus =
      selectedCampus === 'ALL' ||
      entry.school.toLowerCase().includes(selectedCampus.toLowerCase());
    const matchSearch =
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.specialBadge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCampus && matchSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28 text-slate-100 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#0E1B2E] border border-[#C5E5EC]/25 p-6 shadow-xl relative overflow-hidden">
        {/* Brand linear gradient accent strip on top */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#3064AE] via-[#C5E5EC] to-[#E0FAEB]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3064AE]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#3064AE]/20 border border-[#C5E5EC]/30 text-[#C5E5EC] text-xs font-bold">
              <Trophy className="w-4 h-4 text-[#C5E5EC]" />
              <span>Vinh Danh Trợ Thủ Campus Xuất Sắc Hàng Tuần</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bảng Xếp Hạng Top Trợ Thủ Campus
            </h1>
            <p className="text-xs text-[#C5E5EC]/80 max-w-lg">
              Top 3 trợ thủ có điểm tín nhiệm cao nhất & hoàn thành nhiều kèo uy tín nhất nhận thưởng tiền mặt từ Quỹ Thưởng GigMe Campus!
            </p>
          </div>

          {/* Weekly Prize Pool Pill */}
          <div className="p-4 rounded-2xl bg-[#12233B] border border-[#C5E5EC]/30 text-center shrink-0 shadow-md">
            <span className="text-[10px] text-[#C5E5EC] font-bold block uppercase tracking-wider">
              Tổng Giải Thưởng Tuần Này
            </span>
            <span className="text-2xl font-black text-[#E0FAEB] font-mono">1.000.000đ</span>
            <span className="text-[10px] text-[#C5E5EC]/60 block mt-0.5">Top 1: 500k • Top 2: 300k • Top 3: 150k</span>
          </div>
        </div>
      </div>

      {/* Podium Top Cards or Empty State */}
      {filteredLeaders.length >= 3 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top 2: Silver */}
          <div className="order-2 md:order-1 rounded-3xl bg-[#12233B] border border-[#C5E5EC]/20 p-5 text-center shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#0E1B2E] border border-[#C5E5EC]/30 text-[#C5E5EC] text-[10px] font-black">
              HẠNG 2 🥈
            </div>
            <div className="pt-4">
              <img
                src={filteredLeaders[1].avatarUrl}
                alt="Hạng 2"
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#C5E5EC]/50 shadow-sm"
              />
              <h3 className="font-extrabold text-base text-white mt-2">{filteredLeaders[1].name}</h3>
              <p className="text-xs text-[#C5E5EC]/70">{filteredLeaders[1].school}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#3064AE]/30 text-[#C5E5EC] font-bold text-[10px] border border-[#C5E5EC]/25">
                {filteredLeaders[1].specialBadge}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0E1B2E] border border-[#C5E5EC]/15 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#C5E5EC]/70">Đơn hoàn thành:</span>
                <span className="font-bold text-white">{filteredLeaders[1].completedGigs} kèo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#C5E5EC]/70">Thưởng tuần:</span>
                <span className="font-bold text-[#E0FAEB]">300.000đ</span>
              </div>
            </div>
          </div>

          {/* Top 1: Gold Champion */}
          <div className="order-1 md:order-2 rounded-3xl bg-gradient-to-b from-[#162C4E] via-[#12233B] to-[#0E1B2E] border-2 border-[#C5E5EC] p-6 text-center shadow-xl space-y-3 relative overflow-hidden flex flex-col justify-between transform md:-translate-y-2">
            <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#3064AE] border border-[#C5E5EC]/40 text-white text-xs font-black flex items-center space-x-1">
              <Trophy className="w-3.5 h-3.5 text-[#E0FAEB]" />
              <span>QUÁN QUÂN 🥇</span>
            </div>
            <div className="pt-5">
              <div className="relative inline-block">
                <img
                  src={filteredLeaders[0].avatarUrl}
                  alt="Quán quân"
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#C5E5EC] shadow-lg"
                />
                <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full bg-gradient-to-r from-[#3064AE] to-[#417AC6] text-white border border-[#C5E5EC]/40 font-black text-[10px] uppercase shadow-md">
                  Top 1 Campus
                </span>
              </div>
              <h3 className="font-black text-lg text-white mt-3">{filteredLeaders[0].name}</h3>
              <p className="text-xs text-[#C5E5EC] font-medium">{filteredLeaders[0].school}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#3064AE]/40 border border-[#C5E5EC]/30 text-[#E0FAEB] font-extrabold text-[11px]">
                👑 {filteredLeaders[0].specialBadge}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0E1B2E] border border-[#C5E5EC]/20 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#C5E5EC]/70 font-semibold">Tín nhiệm:</span>
                <span className="font-mono font-black text-[#C5E5EC]">{filteredLeaders[0].trustScore}/850</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#C5E5EC]/70 font-semibold">Hoàn thành:</span>
                <span className="font-bold text-[#E0FAEB]">{filteredLeaders[0].completedGigs} đơn</span>
              </div>
              <div className="flex justify-between border-t border-[#C5E5EC]/15 pt-1">
                <span className="text-white font-bold">Thưởng hiện kim:</span>
                <span className="font-black text-[#E0FAEB] font-mono text-sm">500.000đ</span>
              </div>
            </div>
          </div>

          {/* Top 3: Bronze */}
          <div className="order-3 rounded-3xl bg-[#12233B] border border-[#C5E5EC]/20 p-5 text-center shadow-md space-y-3 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#0E1B2E] border border-[#C5E5EC]/30 text-[#C5E5EC] text-[10px] font-black">
              HẠNG 3 🥉
            </div>
            <div className="pt-4">
              <img
                src={filteredLeaders[2].avatarUrl}
                alt="Hạng 3"
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#C5E5EC]/40 shadow-sm"
              />
              <h3 className="font-extrabold text-base text-white mt-2">{filteredLeaders[2].name}</h3>
              <p className="text-xs text-[#C5E5EC]/70">{filteredLeaders[2].school}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#3064AE]/30 border border-[#C5E5EC]/25 text-[#C5E5EC] font-bold text-[10px]">
                {filteredLeaders[2].specialBadge}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0E1B2E] border border-[#C5E5EC]/15 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#C5E5EC]/70">Đơn hoàn thành:</span>
                <span className="font-bold text-white">{filteredLeaders[2].completedGigs} kèo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#C5E5EC]/70">Thưởng tuần:</span>
                <span className="font-bold text-[#E0FAEB]">150.000đ</span>
              </div>
            </div>
          </div>
        </div>
      ) : filteredLeaders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredLeaders.map((leader) => (
            <div
              key={leader.userId}
              className="rounded-3xl bg-[#12233B] border border-[#C5E5EC]/25 p-5 text-center shadow-md space-y-3"
            >
              <div className="inline-block px-2.5 py-0.5 rounded-full bg-[#3064AE]/40 text-[#C5E5EC] border border-[#C5E5EC]/30 text-xs font-black">
                Hạng #{leader.rank} 🏆
              </div>
              <img
                src={leader.avatarUrl}
                alt={leader.name}
                className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#C5E5EC]/40 shadow-sm"
              />
              <h3 className="font-extrabold text-base text-white">{leader.name}</h3>
              <p className="text-xs text-[#C5E5EC]/70">{leader.school}</p>
              <div className="p-2.5 rounded-xl bg-[#0E1B2E] border border-[#C5E5EC]/15 text-xs flex justify-around">
                <div>
                  <span className="text-[#C5E5EC]/60 block text-[10px]">Hoàn thành</span>
                  <span className="font-bold text-white">{leader.completedGigs} đơn</span>
                </div>
                <div>
                  <span className="text-[#C5E5EC]/60 block text-[10px]">Tín nhiệm</span>
                  <span className="font-bold text-[#C5E5EC]">{leader.trustScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#12233B] border border-[#C5E5EC]/20 p-10 text-center flex flex-col items-center justify-center space-y-3 shadow-md">
          <div className="w-14 h-14 rounded-2xl bg-[#3064AE]/30 border border-[#C5E5EC]/30 flex items-center justify-center text-[#C5E5EC]">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Chưa có sinh viên trên bảng xếp hạng</h3>
          <p className="text-xs text-[#C5E5EC]/70 max-w-md leading-relaxed">
            Bảng xếp hạng được tổng hợp 100% từ kết quả việc làm thật đã hoàn thành. Hãy nhận việc làm đầu tiên quanh trường để được vinh danh Quán quân!
          </p>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#C5E5EC]/60 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm tên trợ thủ, trường, kỹ năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-[#12233B] border border-[#C5E5EC]/25 text-xs text-white placeholder:text-[#C5E5EC]/40 focus:border-[#3064AE] focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {CAMPUS_OPTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCampus(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCampus === c.id
                  ? 'bg-[#3064AE] text-white border border-[#C5E5EC]/30 shadow-sm'
                  : 'bg-[#12233B] border border-[#C5E5EC]/20 text-[#C5E5EC] hover:bg-[#162B48]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="rounded-3xl bg-[#0E1B2E] border border-[#C5E5EC]/20 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#C5E5EC]/15 flex items-center justify-between bg-[#12233B]/50">
          <h2 className="font-extrabold text-sm text-white flex items-center space-x-2">
            <Medal className="w-4 h-4 text-[#C5E5EC]" />
            <span>Xếp Hạng Chi Tiết ({filteredLeaders.length} Trợ Thủ)</span>
          </h2>
          <span className="text-[11px] text-[#C5E5EC]/70">Tự động cập nhật mỗi 00:00 Chủ Nhật</span>
        </div>

        <div className="divide-y divide-[#C5E5EC]/10">
          {filteredLeaders.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#C5E5EC]/60">
              Chưa có dữ liệu trợ thủ nào trong danh mục hoặc campus này.
            </div>
          ) : (
            filteredLeaders.map((entry) => (
            <div
              key={entry.userId}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#12233B] transition"
            >
              <div className="flex items-center space-x-3.5">
                {/* Rank Badge */}
                <div
                  className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                    entry.rank === 1
                      ? 'bg-gradient-to-tr from-[#3064AE] to-[#C5E5EC] text-white shadow-md font-extrabold border border-[#E0FAEB]/30'
                      : entry.rank === 2
                      ? 'bg-[#162C4E] text-[#C5E5EC] border border-[#C5E5EC]/30'
                      : entry.rank === 3
                      ? 'bg-[#12233B] text-[#E0FAEB] border border-[#C5E5EC]/20'
                      : 'bg-[#0A1424] text-[#C5E5EC]/70 border border-[#C5E5EC]/10'
                  }`}
                >
                  #{entry.rank}
                </div>

                {/* Avatar */}
                <img
                  src={entry.avatarUrl}
                  alt={entry.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#C5E5EC]/30 shrink-0"
                />

                {/* Details */}
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-sm text-white">{entry.name}</h4>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3064AE]/30 text-[#C5E5EC] font-bold border border-[#C5E5EC]/25">
                      {entry.specialBadge}
                    </span>
                  </div>
                  <p className="text-xs text-[#C5E5EC]/70">{entry.school}</p>
                  <p className="text-[11px] text-[#C5E5EC]/50 mt-0.5 italic">
                    Gần đây: &quot;{entry.recentGigTitle}&quot;
                  </p>
                </div>
              </div>

              {/* Stats & Hire Button */}
              <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#C5E5EC]/10">
                <div className="text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span className="font-bold text-xs text-white">{entry.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-[#C5E5EC]/60">({entry.completedGigs} đơn)</span>
                  </div>
                  <div className="text-[11px] text-[#C5E5EC]/70 mt-0.5">
                    Tín nhiệm: <span className="text-[#C5E5EC] font-mono font-bold">{entry.trustScore}</span> • Đúng hạn:{' '}
                    <span className="text-[#E0FAEB] font-bold">{entry.onTimeRate}%</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onSelectFreelancer) onSelectFreelancer(entry.name);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#3064AE] hover:bg-[#255294] text-white border border-[#C5E5EC]/30 text-xs font-bold transition flex items-center space-x-1 active:scale-95 shadow-md cursor-pointer"
                >
                  <span>Thuê</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
};
