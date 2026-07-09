import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function SubmeterSinal() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const [form, setForm] = useState({
    termo_portugues: "",
    descricao: "",
    variacao_regional: "",
    sinonimos: "",
    categorias: "",
    video_url: "",
    foto_mao_url: "",
    ponto_articulacao: "",
    configuracao_mao: "",
    disposicao_maos: "",
    orientacao_mao: "",
    regiao_contato: "",
    componente_nao_manual: "",
    tipo_sinal: "",
    aceitou_tcle: false,
    sinalizante_menor: false,
    nome_responsavel_legal: "",
    cpf_responsavel: "",
  });

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "Erro", description: "O vídeo deve ter no máximo 50MB.", variant: "destructive", duration: 3000 });
      return;
    }
    setUploadingVideo(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update("video_url", file_url);
    setUploadingVideo(false);
    toast({ title: "Vídeo enviado com sucesso!", duration: 3000 });
  };

  const handleFotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Erro", description: "A foto deve ter no máximo 10MB.", variant: "destructive", duration: 3000 });
      return;
    }
    setUploadingFoto(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    update("foto_mao_url", file_url);
    setUploadingFoto(false);
    toast({ title: "Foto enviada com sucesso!", duration: 3000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.aceitou_tcle) {
      toast({ title: "Termo obrigatório", description: "Você deve aceitar o Termo de Consentimento (LGPD).", variant: "destructive", duration: 3000 });
      return;
    }
    if (!form.video_url || !form.foto_mao_url) {
      toast({ title: "Mídias obrigatórias", description: "Envie o vídeo e a foto da configuração de mão.", variant: "destructive", duration: 3000 });
      return;
    }
    if (form.sinalizante_menor && (!form.nome_responsavel_legal || !form.cpf_responsavel)) {
      toast({ title: "Dados do responsável", description: "Para menores de idade, informe nome e CPF do responsável legal.", variant: "destructive", duration: 3000 });
      return;
    }

    setSubmitting(true);
    await base44.entities.Sinal.create({ ...form, status: "Pendente" });
    toast({ title: "Sinal submetido!", description: "Aguarde a aprovação da curadoria.", duration: 3000 });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao dicionário
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 font-heading">Submeter Novo Sinal</h1>
          <p className="text-sm text-slate-500 mb-8">Preencha os dados do sinal e envie para revisão da curadoria.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Section title="Informações Básicas">
              <Field label="Termo em Português *">
                <Input required value={form.termo_portugues} onChange={(e) => update("termo_portugues", e.target.value)} aria-label="Termo em português" />
              </Field>
              <Field label="Descrição *">
                <Textarea required value={form.descricao} onChange={(e) => update("descricao", e.target.value)} rows={3} aria-label="Descrição do sinal" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Variação Regional *">
                  <Select value={form.variacao_regional} onValueChange={(v) => update("variacao_regional", v)}>
                    <SelectTrigger aria-label="Variação regional"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nacional">Nacional</SelectItem>
                      <SelectItem value="Estadual">Estadual</SelectItem>
                      <SelectItem value="Municipal">Municipal</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Categorias">
                  <Input value={form.categorias} onChange={(e) => update("categorias", e.target.value)} placeholder="Ex: Saudações, Família" aria-label="Categorias" />
                </Field>
              </div>
              <Field label="Sinônimos">
                <Input value={form.sinonimos} onChange={(e) => update("sinonimos", e.target.value)} placeholder="Separados por vírgula" aria-label="Sinônimos" />
              </Field>
            </Section>

            <Section title="Parâmetros Gramaticais da Libras">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Ponto de Articulação *">
                  <Input required value={form.ponto_articulacao} onChange={(e) => update("ponto_articulacao", e.target.value)} aria-label="Ponto de articulação" />
                </Field>
                <Field label="Configuração de Mão *">
                  <Input required value={form.configuracao_mao} onChange={(e) => update("configuracao_mao", e.target.value)} aria-label="Configuração de mão" />
                </Field>
                <Field label="Disposição das Mãos *">
                  <Select value={form.disposicao_maos} onValueChange={(v) => update("disposicao_maos", v)}>
                    <SelectTrigger aria-label="Disposição das mãos"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paralela">Paralela</SelectItem>
                      <SelectItem value="Cruzada">Cruzada</SelectItem>
                      <SelectItem value="Entrelaçada">Entrelaçada</SelectItem>
                      <SelectItem value="Uma sobre a outra">Uma sobre a outra</SelectItem>
                      <SelectItem value="Uma ao lado da outra">Uma ao lado da outra</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Orientação da Mão *">
                  <Input required value={form.orientacao_mao} onChange={(e) => update("orientacao_mao", e.target.value)} aria-label="Orientação da mão" />
                </Field>
                <Field label="Região de Contato *">
                  <Input required value={form.regiao_contato} onChange={(e) => update("regiao_contato", e.target.value)} aria-label="Região de contato" />
                </Field>
                <Field label="Componente Não-Manual *">
                  <Select value={form.componente_nao_manual} onValueChange={(v) => update("componente_nao_manual", v)}>
                    <SelectTrigger aria-label="Componente não-manual"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Expressão de Interrogação">Expressão de Interrogação</SelectItem>
                      <SelectItem value="Expressão de Negação">Expressão de Negação</SelectItem>
                      <SelectItem value="Bochechas Infladas">Bochechas Infladas</SelectItem>
                      <SelectItem value="Boca Aberta">Boca Aberta</SelectItem>
                      <SelectItem value="Nenhum">Nenhum</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Tipo de Sinal *">
                  <Select value={form.tipo_sinal} onValueChange={(v) => update("tipo_sinal", v)}>
                    <SelectTrigger aria-label="Tipo de sinal"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uma mão">Uma mão</SelectItem>
                      <SelectItem value="Duas mãos iguais">Duas mãos iguais</SelectItem>
                      <SelectItem value="Duas mãos diferentes">Duas mãos diferentes</SelectItem>
                      <SelectItem value="Movimento facial">Movimento facial</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>

            <Section title="Mídias (Obrigatórias)">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Vídeo do Sinal (máx. 50MB) *</Label>
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-emerald-400 transition-colors">
                    {uploadingVideo ? (
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : form.video_url ? (
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-500">{form.video_url ? "Vídeo enviado" : "Clique para enviar"}</span>
                    <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleVideoUpload} aria-label="Upload do vídeo" />
                  </label>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Foto da Mão (máx. 10MB) *</Label>
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-emerald-400 transition-colors">
                    {uploadingFoto ? (
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    ) : form.foto_mao_url ? (
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <Upload className="w-8 h-8 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-500">{form.foto_mao_url ? "Foto enviada" : "Clique para enviar"}</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFotoUpload} aria-label="Upload da foto" />
                  </label>
                </div>
              </div>
            </Section>

            <Section title="Consentimento (LGPD)">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={form.sinalizante_menor}
                  onCheckedChange={(v) => update("sinalizante_menor", v)}
                  id="menor"
                  aria-label="O sinalizante é menor de 18 anos"
                />
                <Label htmlFor="menor" className="text-sm text-slate-700 cursor-pointer">O sinalizante do vídeo é menor de 18 anos</Label>
              </div>

              {form.sinalizante_menor && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <Field label="Nome do Responsável Legal *">
                    <Input value={form.nome_responsavel_legal} onChange={(e) => update("nome_responsavel_legal", e.target.value)} aria-label="Nome do responsável legal" />
                  </Field>
                  <Field label="CPF do Responsável *">
                    <Input value={form.cpf_responsavel} onChange={(e) => update("cpf_responsavel", e.target.value)} placeholder="000.000.000-00" aria-label="CPF do responsável" />
                  </Field>
                </div>
              )}

              <div className="flex items-start gap-3 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <Checkbox
                  checked={form.aceitou_tcle}
                  onCheckedChange={(v) => update("aceitou_tcle", v)}
                  id="tcle"
                  aria-label="Aceito o Termo de Consentimento Livre e Esclarecido"
                />
                <Label htmlFor="tcle" className="text-sm text-slate-700 cursor-pointer leading-relaxed">
                  <span className="font-medium">Termo de Consentimento Livre e Esclarecido (TCLE):</span> Declaro que autorizo o uso público da imagem e vídeo submetidos neste formulário para fins educacionais e de divulgação da Língua Brasileira de Sinais.
                </Label>
              </div>
            </Section>

            <Button type="submit" disabled={submitting || uploadingVideo || uploadingFoto} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-base font-medium">
              {submitting ? "Enviando..." : "Submeter Sinal para Revisão"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <Label className="text-sm font-medium text-slate-700 mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}