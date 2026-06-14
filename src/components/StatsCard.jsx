import React from 'react';

export default function StatsCard({ title, value, icon, gradient }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-200 hover:transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-200 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`bg-gradient-to-br ${gradient} p-4 rounded-2xl shadow-lg`}>
          <span className="text-3xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}
