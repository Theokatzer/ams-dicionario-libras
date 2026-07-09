import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Hand, Eye } from "lucide-react";

export default function SinalDetail() {
  const [sinal, setSinal] = useState(null);
  const [loading, setLoading] = useState(true);

  const id = new URLSearchParams(window.location.search).get("id") ||
    window.location.pathname.split("/sinal/")[1];

  useEffect(() => {
    if (!id) return;
    base44.entities.Sinal.get(id).then((data) => {
      setSinal(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!sinal) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 text-lg">Sinal não encontrado</p>
        <Link to="/" className="text-emerald-600 hover:underline">Voltar ao dicionário</Link>
      </div>
    );
  }

  const parametros = [
    { label: "Ponto de Articulação", value: sinal.ponto_articulacao },
    { label: "Configuração de Mão", value: sinal.configuracao_mao },
    { label: "Disposição das Mãos", value: sinal.disposicao_maos },
    { label: "Orientação da Mão", value: sinal.orientacao_mao },
    { label: "Região de Contato", value: sinal.regiao_contato },
    { label: "Componente Não-Manual", value: sinal.componente_nao_manual },
    { label: "Tipo de Sinal", value: sinal.tipo_sinal },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao dicionário
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="aspect-video bg-slate-900 flex items-center justify-center">
              {sinal.video_url ? (
                <video
                  src={sinal.video_url}
                  controls
                  className="w-full h-full object-contain"
                  aria-label={`Vídeo demonstrativo do sinal: ${sinal.termo_portugues}`}
                />
              ) : (
                <p className="text-slate-400">Sem vídeo</p>
              )}
            </div>
            <div className="aspect-video bg-slate-100 flex items-center justify-center">
              {sinal.foto_mao_url ? (
                <img
                  src={sinal.foto_mao_url}
                  alt={`Foto da configuração de mão: ${sinal.termo_portugues}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <p className="text-slate-400">Sem foto</p>
              )}
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-heading">
                {sinal.termo_portugues}
              </h1>
              <span className="inline-flex items-center gap-1 text-sm px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                <MapPin className="w-3.5 h-3.5" /> {sinal.variacao_regional}
              </span>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">{sinal.descricao}</p>

            {sinal.sinonimos && (
              <p className="text-sm text-slate-500 mb-2">
                <span className="font-medium text-slate-700">Sinônimos:</span> {sinal.sinonimos}
              </p>
            )}
            {sinal.categorias && (
              <p className="text-sm text-slate-500 mb-6">
                <span className="font-medium text-slate-700">Categorias:</span> {sinal.categorias}
              </p>
            )}

            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Hand className="w-5 h-5 text-emerald-600" />
              Parâmetros Gramaticais
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {parametros.map((p) => (
                <div key={p.label} className="bg-slate-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{p.label}</p>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{p.value || "—"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}