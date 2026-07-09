import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, X, Trash2, Edit3, Eye, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Moderacao() {
  const { toast } = useToast();
  const [sinais, setSinais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadSinais();
  }, []);

  const loadSinais = async () => {
    setLoading(true);
    const data = await base44.entities.Sinal.list("-created_date", 50);
    setSinais(data);
    setLoading(false);
  };

  const aprovar = async (id) => {
    await base44.entities.Sinal.update(id, { status: "Aprovado" });
    toast({ title: "Sinal aprovado!", description: "O sinal foi publicado no dicionário.", duration: 3000 });
    setSelected(null);
    loadSinais();
  };

  const rejeitar = async (id) => {
    await base44.entities.Sinal.update(id, { status: "Rejeitado" });
    toast({ title: "Sinal rejeitado", duration: 3000 });
    setSelected(null);
    loadSinais();
  };

  const excluir = async (id) => {
    await base44.entities.Sinal.delete(id);
    toast({ title: "Sinal excluído permanentemente", variant: "destructive", duration: 3000 });
    setSelected(null);
    loadSinais();
  };

  const startEdit = (sinal) => {
    setEditForm({ descricao: sinal.descricao, termo_portugues: sinal.termo_portugues });
    setEditing(true);
  };

  const saveEdit = async () => {
    await base44.entities.Sinal.update(selected.id, editForm);
    toast({ title: "Sinal atualizado!", duration: 3000 });
    setEditing(false);
    setSelected({ ...selected, ...editForm });
    loadSinais();
  };

  const pendentes = sinais.filter((s) => s.status === "Pendente");
  const outros = sinais.filter((s) => s.status !== "Pendente");

  const statusColors = {
    Pendente: "bg-amber-100 text-amber-800",
    Aprovado: "bg-emerald-100 text-emerald-800",
    Rejeitado: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao dicionário
        </Link>

        <h1 className="text-2xl font-bold text-slate-900 mb-1 font-heading">Painel de Moderação</h1>
        <p className="text-sm text-slate-500 mb-8">Avalie, edite, aprove ou rejeite os sinais submetidos.</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Pendentes ({pendentes.length})
            </h2>
            {pendentes.length === 0 ? (
              <p className="text-slate-400 mb-8 text-sm">Nenhum sinal pendente de revisão.</p>
            ) : (
              <div className="space-y-3 mb-8">
                {pendentes.map((s) => (
                  <SinalRow key={s.id} sinal={s} statusColors={statusColors} onSelect={() => setSelected(s)} />
                ))}
              </div>
            )}

            <h2 className="text-lg font-semibold text-slate-800 mb-4">Histórico</h2>
            {outros.length === 0 ? (
              <p className="text-slate-400 text-sm">Nenhum sinal processado ainda.</p>
            ) : (
              <div className="space-y-3">
                {outros.map((s) => (
                  <SinalRow key={s.id} sinal={s} statusColors={statusColors} onSelect={() => setSelected(s)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setEditing(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selected.termo_portugues}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 my-4">
                {selected.video_url && (
                  <video src={selected.video_url} controls className="w-full aspect-video rounded-lg bg-slate-900" aria-label="Vídeo do sinal" />
                )}
                {selected.foto_mao_url && (
                  <img src={selected.foto_mao_url} alt="Foto da mão" className="w-full aspect-video rounded-lg object-cover bg-slate-100" />
                )}
              </div>

              {editing ? (
                <div className="space-y-3">
                  <Input value={editForm.termo_portugues} onChange={(e) => setEditForm({ ...editForm, termo_portugues: e.target.value })} aria-label="Editar termo" />
                  <Textarea value={editForm.descricao} onChange={(e) => setEditForm({ ...editForm, descricao: e.target.value })} aria-label="Editar descrição" />
                  <div className="flex gap-2">
                    <Button onClick={saveEdit} size="sm" className="bg-emerald-600 hover:bg-emerald-700">Salvar</Button>
                    <Button onClick={() => setEditing(false)} size="sm" variant="outline">Cancelar</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-600">{selected.descricao}</p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[
                      ["Variação", selected.variacao_regional],
                      ["Ponto de Articulação", selected.ponto_articulacao],
                      ["Config. de Mão", selected.configuracao_mao],
                      ["Disposição", selected.disposicao_maos],
                      ["Orientação", selected.orientacao_mao],
                      ["Região de Contato", selected.regiao_contato],
                      ["Comp. Não-Manual", selected.componente_nao_manual],
                      ["Tipo de Sinal", selected.tipo_sinal],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-slate-50 rounded-lg px-3 py-2">
                        <p className="text-[10px] text-slate-400 uppercase">{l}</p>
                        <p className="text-xs font-medium text-slate-700">{v || "—"}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                {selected.status === "Pendente" && (
                  <>
                    <Button onClick={() => aprovar(selected.id)} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                      <Check className="w-4 h-4 mr-1" /> Aprovar
                    </Button>
                    <Button onClick={() => rejeitar(selected.id)} size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                      <X className="w-4 h-4 mr-1" /> Rejeitar
                    </Button>
                  </>
                )}
                <Button onClick={() => startEdit(selected)} size="sm" variant="outline">
                  <Edit3 className="w-4 h-4 mr-1" /> Editar
                </Button>
                <Button onClick={() => excluir(selected.id)} size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 ml-auto">
                  <Trash2 className="w-4 h-4 mr-1" /> Excluir
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SinalRow({ sinal, statusColors, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-slate-300 hover:shadow-sm transition-all text-left"
      aria-label={`Revisar sinal: ${sinal.termo_portugues}`}
    >
      <div className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
        {sinal.foto_mao_url ? (
          <img src={sinal.foto_mao_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-300">
            {sinal.termo_portugues?.[0]}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate">{sinal.termo_portugues}</p>
        <p className="text-xs text-slate-400 truncate">{sinal.descricao}</p>
      </div>
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[sinal.status] || "bg-slate-100 text-slate-600"}`}>
        {sinal.status}
      </span>
      <Eye className="w-4 h-4 text-slate-400 flex-shrink-0" />
    </button>
  );
}