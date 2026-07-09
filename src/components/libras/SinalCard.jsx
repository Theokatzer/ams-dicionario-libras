import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Play, MapPin } from "lucide-react";

export default function SinalCard({ sinal }) {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300">
      <div className="relative aspect-video bg-slate-100">
        {showVideo && sinal.video_url ? (
          <video
            src={sinal.video_url}
            controls
            autoPlay
            className="w-full h-full object-cover"
            aria-label={`Vídeo do sinal: ${sinal.termo_portugues}`}
          />
        ) : (
          <>
            {sinal.foto_mao_url ? (
              <img
                src={sinal.foto_mao_url}
                alt={`Configuração de mão para o sinal: ${sinal.termo_portugues}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
                <span className="text-4xl font-bold text-emerald-300">{sinal.termo_portugues?.[0]}</span>
              </div>
            )}
            {sinal.video_url && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Reproduzir vídeo do sinal ${sinal.termo_portugues}`}
              >
                <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-emerald-600 ml-0.5" />
                </div>
              </button>
            )}
          </>
        )}
      </div>

      <div className="p-4">
        <Link to={`/sinal/${sinal.id}`} className="block">
          <h3 className="text-lg font-semibold text-slate-900 hover:text-emerald-600 transition-colors">
            {sinal.termo_portugues}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{sinal.descricao}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full">
            <MapPin className="w-3 h-3" />
            {sinal.variacao_regional}
          </span>
          <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
            {sinal.tipo_sinal}
          </span>
        </div>
      </div>
    </div>
  );
}