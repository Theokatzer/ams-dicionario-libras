import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, BookOpen, Video } from "lucide-react";
import { Link } from "react-router-dom";
import SinalCard from "@/components/libras/SinalCard";

export default function Home() {
  const [sinais, setSinais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroRegiao, setFiltroRegiao] = useState("todas");

  useEffect(() => {
    loadSinais();
  }, []);

  const loadSinais = async () => {
    setLoading(true);
    const data = await base44.entities.Sinal.filter({ status: "Aprovado" });
    setSinais(data);
    setLoading(false);
  };

  const sinaisFiltrados = sinais.filter((s) => {
    const matchBusca = s.termo_portugues?.toLowerCase().includes(busca.toLowerCase()) ||
      s.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
      s.sinonimos?.toLowerCase().includes(busca.toLowerCase());
    const matchRegiao = filtroRegiao === "todas" || s.variacao_regional === filtroRegiao;
    return matchBusca && matchRegiao;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 font-heading">Dicionário de Libras</h1>
              <p className="text-xs text-slate-500">Língua Brasileira de Sinais</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/submeter" className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              Submeter Sinal
            </Link>
            <Link to="/moderacao" className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
              Moderação
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 font-heading">
            Explore os sinais em Libras
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Pesquise termos, assista aos vídeos demonstrativos e aprenda a configuração correta dos sinais.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar termo em português..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10 h-11"
              aria-label="Buscar termo no dicionário"
            />
          </div>
          <Select value={filtroRegiao} onValueChange={setFiltroRegiao}>
            <SelectTrigger className="w-full sm:w-44 h-11" aria-label="Filtrar por variação regional">
              <SelectValue placeholder="Variação regional" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as regiões</SelectItem>
              <SelectItem value="Nacional">Nacional</SelectItem>
              <SelectItem value="Estadual">Estadual</SelectItem>
              <SelectItem value="Municipal">Municipal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : sinaisFiltrados.length === 0 ? (
          <div className="text-center py-20">
            <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Nenhum sinal encontrado</p>
            <p className="text-slate-400 text-sm mt-1">Tente outro termo ou filtro de região</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sinaisFiltrados.map((sinal) => (
              <SinalCard key={sinal.id} sinal={sinal} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}