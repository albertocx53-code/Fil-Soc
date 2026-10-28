// Catálogo do Fil&Soc. Todo o conteúdo vem de src/data/catalogo.json:
// para adicionar filmes, slides, vídeos ou materiais, edite esse arquivo (o README explica como).
// Este módulo é puro: funciona no servidor e no navegador.
import dados from '@/data/catalogo.json';

export type Arte = { motif?: string; c1?: string; c2?: string; accent?: string; kicker?: string };
export type Link = { titulo: string; url: string };
export type Material = Link & { formato?: string };

export type Ficha = {
  porQue: string;
  conceitos: string[];
  pensadores: string[];
  objetivos: string[];
  perguntas: string[];
  plano: { etapa: string; tempo: string; descricao: string }[];
  atividades: { nome: string; descricao: string }[];
  roteiro: { momento: string; observar: string }[];
  dicas: string[];
  referencias: string[];
};

export type Titulo = {
  slug: string;
  tipo: 'filme' | 'documentario' | 'curta' | 'serie' | 'videoaula';
  titulo: string;
  tituloOriginal: string | null;
  chamada: string | null;
  sinopse: string;
  ano: number | null;
  duracao: number | null;
  pais: string | null;
  idiomas: string[];
  generos: string[];
  disciplinas: string[];
  faixa: string[];
  arte: Arte;
  capa?: string | null;
  banner?: string | null;
  destaque: boolean;
  ordemDestaque: number | null;
  popularidade: number;
  direcao: string[];
  elenco: string[];
  temas: string[];
  ondeAssistir: { rotulo: string; url: string }[];
  /** Apresentações (Canva, Google Slides, PowerPoint online). Use o link de "incorporar" ou de visualização. */
  slides: Link[];
  /** Vídeos (YouTube, Vimeo, Google Drive). */
  videos: Link[];
  /** Arquivos para baixar (PDF, DOCX, PPTX) hospedados no Google Drive, Dropbox etc. */
  materiais: Material[];
  ficha: Ficha | null;
};

export type Categoria = { slug: string; nome: string; tipo: 'tema' | 'pensador' | 'conceito' | 'colecao' | 'genero' };
export type Fileira = { slug: string; nome: string; itens: Titulo[]; ranking?: boolean };

// Campos que podem faltar no arquivo de dados recebem um valor padrão
const TITULOS: Titulo[] = (dados.titulos as unknown as Partial<Titulo>[]).map(
  (t) => ({ slides: [], videos: [], materiais: [], ondeAssistir: [], temas: [], ...t }) as Titulo,
);
const CATEGORIAS = dados.categorias as unknown as Categoria[];

export const TIPO: Record<string, string> = {
  filme: 'Filme', documentario: 'Documentário', curta: 'Curta', serie: 'Série', videoaula: 'Videoaula',
};
export const DISCIPLINA: Record<string, string> = { filosofia: 'Filosofia', sociologia: 'Sociologia' };

export function todos(): Titulo[] {
  return TITULOS;
}

export function porSlug(slug: string): Titulo | undefined {
  return TITULOS.find((t) => t.slug === slug);
}

export function categoria(slug: string): Categoria | undefined {
  return CATEGORIAS.find((c) => c.slug === slug);
}

export function temasDo(t: Titulo, tipo?: Categoria['tipo']): Categoria[] {
  return t.temas.map(categoria).filter((c): c is Categoria => !!c && (!tipo || c.tipo === tipo));
}

export const temMaterial = (t: Titulo) => t.slides.length + t.videos.length + t.materiais.length > 0;

const porPopularidade = (a: Titulo, b: Titulo) => b.popularidade - a.popularidade;
const comTema = (slug: string) => TITULOS.filter((t) => t.temas.includes(slug)).sort(porPopularidade);

export function destaques(): Titulo[] {
  return TITULOS.filter((t) => t.destaque).sort((a, b) => (a.ordemDestaque ?? 99) - (b.ordemDestaque ?? 99));
}

/** Fileiras da tela inicial (as vazias são escondidas). */
export function fileirasInicio(): Fileira[] {
  const f: Fileira[] = [
    { slug: 'em-alta', nome: 'Em alta nas salas de aula', itens: [...TITULOS].sort(porPopularidade).slice(0, 10), ranking: true },
    { slug: 'slides', nome: 'Com slides prontos para a aula', itens: TITULOS.filter((t) => t.slides.length > 0) },
    { slug: 'destaque', nome: 'Em destaque no Fil&Soc', itens: destaques() },
    { slug: 'filosofia', nome: 'Filmes de Filosofia', itens: TITULOS.filter((t) => t.disciplinas.includes('filosofia')).sort(porPopularidade) },
    { slug: 'sociologia', nome: 'Filmes de Sociologia', itens: TITULOS.filter((t) => t.disciplinas.includes('sociologia')).sort(porPopularidade) },
    { slug: 'documentarios', nome: 'Documentários essenciais', itens: TITULOS.filter((t) => t.tipo === 'documentario') },
    { slug: 'videoaulas', nome: 'Videoaulas', itens: TITULOS.filter((t) => t.tipo === 'videoaula' || t.videos.length > 0) },
    { slug: 'filosofia-politica', nome: 'Filosofia política', itens: comTema('filosofia-politica') },
    { slug: 'etica-e-moral', nome: 'Ética e moral', itens: comTema('etica-e-moral') },
    { slug: 'cultura-e-sociedade', nome: 'Cultura e sociedade', itens: comTema('cultura-e-sociedade') },
    { slug: 'trabalho', nome: 'Trabalho e capitalismo', itens: comTema('trabalho-e-capitalismo') },
    { slug: 'direitos-humanos', nome: 'Direitos humanos', itens: comTema('direitos-humanos') },
    { slug: 'conhecimento', nome: 'Teoria do conhecimento', itens: comTema('teoria-do-conhecimento') },
    { slug: 'debates', nome: 'Filmes para debates', itens: comTema('para-debate') },
  ];
  return f.filter((x) => x.itens.length > 0);
}

export const SECOES = {
  filmes: { nome: 'Filmes', texto: 'Longas-metragens selecionados para discutir grandes questões em sala.', filtro: (t: Titulo) => t.tipo === 'filme' },
  documentarios: { nome: 'Documentários', texto: 'Documentários para conectar teoria e realidade.', filtro: (t: Titulo) => t.tipo === 'documentario' },
  filosofia: { nome: 'Filosofia', texto: 'Do mito da caverna à ética contemporânea.', filtro: (t: Titulo) => t.disciplinas.includes('filosofia') },
  sociologia: { nome: 'Sociologia', texto: 'Trabalho, cultura, poder e vida em sociedade.', filtro: (t: Titulo) => t.disciplinas.includes('sociologia') },
  slides: { nome: 'Slides', texto: 'Títulos com apresentações prontas para projetar em sala.', filtro: (t: Titulo) => t.slides.length > 0 },
} as const;
export type SecaoSlug = keyof typeof SECOES;

export function secao(slug: SecaoSlug) {
  const s = SECOES[slug];
  const itens = TITULOS.filter(s.filtro).sort(porPopularidade);
  const temas = CATEGORIAS.filter((c) => c.tipo === 'tema' || c.tipo === 'colecao')
    .map((c) => ({ slug: c.slug, nome: c.nome, itens: itens.filter((t) => t.temas.includes(c.slug)) }))
    .filter((f) => f.itens.length > 0);
  return { ...s, itens, temas };
}

/** Títulos parecidos: mais temas em comum primeiro. */
export function relacionados(t: Titulo): Titulo[] {
  return TITULOS.filter((o) => o.slug !== t.slug)
    .map((o) => ({ o, n: o.temas.filter((x) => t.temas.includes(x)).length }))
    .sort((a, b) => b.n - a.n || b.o.popularidade - a.o.popularidade)
    .map((x) => x.o)
    .slice(0, 12);
}

// ---------------------------------------------------------------------
// Busca (sem acento, por título, diretor, elenco, pensador, conceito, tema)
// ---------------------------------------------------------------------
export const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function textoDeBusca(t: Titulo) {
  return semAcento(
    [
      t.titulo, t.tituloOriginal, t.sinopse, ...t.generos, ...t.disciplinas, ...t.direcao, ...t.elenco,
      ...temasDo(t).map((c) => c.nome), ...(t.ficha?.conceitos ?? []), ...(t.ficha?.pensadores ?? []),
    ].filter(Boolean).join(' '),
  );
}
const INDICE = TITULOS.map((t) => ({ t, texto: textoDeBusca(t), nome: semAcento(t.titulo) }));

export type Filtros = { q?: string; tipo?: string; disciplina?: string; duracao?: string; ordem?: string; slides?: boolean };

export function buscar(f: Filtros): Titulo[] {
  const termos = semAcento(f.q ?? '').split(/\s+/).filter(Boolean);
  let r = INDICE.filter(({ t, texto }) => {
    if (!termos.every((x) => texto.includes(x))) return false;
    if (f.tipo && t.tipo !== f.tipo) return false;
    if (f.disciplina && !t.disciplinas.includes(f.disciplina)) return false;
    if (f.slides && t.slides.length === 0) return false;
    if (f.duracao === 'curta' && !(t.duracao && t.duracao <= 40)) return false;
    if (f.duracao === 'media' && !(t.duracao && t.duracao > 40 && t.duracao <= 100)) return false;
    if (f.duracao === 'longa' && !(t.duracao && t.duracao > 100)) return false;
    return true;
  });
  const q = semAcento(f.q ?? '');
  if (f.ordem === 'recentes') r = r.sort((a, b) => (b.t.ano ?? 0) - (a.t.ano ?? 0));
  else if (f.ordem === 'populares') r = r.sort((a, b) => b.t.popularidade - a.t.popularidade);
  else r = r.sort((a, b) => Number(b.nome.includes(q)) - Number(a.nome.includes(q)) || b.t.popularidade - a.t.popularidade);
  return r.map((x) => x.t);
}

export type Sugestao = { rotulo: string; href: string; tipo: string };
export function sugestoes(q: string): Sugestao[] {
  const s = semAcento(q.trim());
  if (s.length < 2) return [];
  const titulos = INDICE.filter((x) => x.nome.includes(s) || semAcento(x.t.tituloOriginal ?? '').includes(s))
    .slice(0, 5)
    .map((x) => ({ rotulo: x.t.titulo, href: `/titulo/${x.t.slug}`, tipo: 'Título' }));
  const ROT: Record<string, string> = { pensador: 'Pensador', conceito: 'Conceito', tema: 'Tema', colecao: 'Coleção', genero: 'Gênero' };
  const cats = CATEGORIAS.filter((c) => semAcento(c.nome).includes(s))
    .slice(0, 5)
    .map((c) => ({ rotulo: c.nome, href: `/buscar?q=${encodeURIComponent(c.nome)}`, tipo: ROT[c.tipo] ?? 'Tema' }));
  return [...titulos, ...cats];
}

export function duracao(min: number | null) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h}h ${String(m).padStart(2, '0')}min` : `${m}min`;
}

/** Converte links comuns de Canva, Google Slides/Drive, YouTube e Vimeo para o formato de incorporar. */
export function linkIncorporavel(url: string): string | null {
  try {
    const u = new URL(url);
    const h = u.hostname.replace(/^www\./, '');
    if (h === 'youtube.com' || h === 'm.youtube.com') {
      const id = u.searchParams.get('v') ?? (u.pathname.startsWith('/embed/') ? u.pathname.split('/')[2] : null);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (h === 'youtu.be') return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (h === 'vimeo.com') return `https://player.vimeo.com/video/${u.pathname.split('/').filter(Boolean)[0]}`;
    if (h === 'player.vimeo.com') return url;
    if (h === 'canva.com') {
      const base = url.split('?')[0].replace(/\/(edit|view)\/?$/, '/view');
      return `${base.endsWith('/view') ? base : base + '/view'}?embed`;
    }
    if (h === 'docs.google.com' && u.pathname.includes('/presentation/')) {
      const id = u.pathname.split('/d/')[1]?.split('/')[0];
      return id ? `https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false` : null;
    }
    if (h === 'drive.google.com') {
      const id = u.pathname.split('/d/')[1]?.split('/')[0] ?? u.searchParams.get('id');
      return id ? `https://drive.google.com/file/d/${id}/preview` : null;
    }
    return null;
  } catch {
    return null;
  }
}
