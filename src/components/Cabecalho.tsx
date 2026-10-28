'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { sugestoes } from '@/lib/catalogo';
import { Logo } from './brand';
import { IconChevronDown, IconHome, IconList, IconSearch, IconFilm, IconX } from './icons';

const NAV = [
  { href: '/', rotulo: 'Início' },
  { href: '/secao/filmes', rotulo: 'Filmes' },
  { href: '/secao/documentarios', rotulo: 'Documentários' },
  { href: '/secao/filosofia', rotulo: 'Filosofia' },
  { href: '/secao/sociologia', rotulo: 'Sociologia' },
  { href: '/secao/slides', rotulo: 'Slides' },
  { href: '/minha-lista', rotulo: 'Minha lista' },
];

function useForaDoClique(ref: RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const m = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) fn(); };
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') fn(); };
    document.addEventListener('mousedown', m);
    document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', m); document.removeEventListener('keydown', k); };
  });
}

function Busca() {
  const router = useRouter();
  const [aberta, setAberta] = useState(false);
  const [q, setQ] = useState('');
  const caixa = useRef<HTMLDivElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const [fechada, setFechada] = useState(false);
  useForaDoClique(caixa, () => { setFechada(true); if (!q) setAberta(false); });
  const itens = aberta ? sugestoes(q) : [];
  useEffect(() => setFechada(false), [q]);

  return (
    <div className={`search-box${aberta ? ' is-open' : ''}`} ref={caixa}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); setFechada(true); if (q.trim()) router.push(`/buscar?q=${encodeURIComponent(q.trim())}`); }}>
        <button
          type={aberta ? 'submit' : 'button'}
          className="tool-btn"
          aria-label={aberta ? 'Pesquisar' : 'Abrir pesquisa'}
          onClick={(e) => { if (!aberta) { e.preventDefault(); setAberta(true); setTimeout(() => campo.current?.focus(), 30); } }}
        >
          <IconSearch />
        </button>
        <input ref={campo} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filmes, filósofos, conceitos" aria-label="Pesquisar no Fil&Soc" tabIndex={aberta ? 0 : -1} autoComplete="off" />
        {aberta && q && <button type="button" className="tool-btn" aria-label="Limpar" onClick={() => { setQ(''); campo.current?.focus(); }}><IconX /></button>}
      </form>
      {itens.length > 0 && !fechada && (
        <div className="suggest" role="listbox" aria-label="Sugestões">
          {itens.map((s) => (
            <Link key={s.href + s.rotulo} href={s.href} role="option" aria-selected={false} onClick={() => setFechada(true)}>
              <span>{s.rotulo}</span><small>{s.tipo}</small>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Cabecalho() {
  const caminho = usePathname();
  const [solido, setSolido] = useState(false);
  const [menu, setMenu] = useState(false);
  const nav = useRef<HTMLDivElement>(null);
  useForaDoClique(nav, () => setMenu(false));

  useEffect(() => {
    const rolar = () => setSolido(window.scrollY > 20);
    rolar();
    window.addEventListener('scroll', rolar, { passive: true });
    return () => window.removeEventListener('scroll', rolar);
  }, []);
  useEffect(() => setMenu(false), [caminho]);

  const atual = NAV.find((n) => n.href === caminho)?.rotulo ?? 'Navegar';

  return (
    <>
      <header className={`app-header${solido ? ' is-solid' : ''}`}>
        <Logo href="/" />
        <div ref={nav}>
          <button type="button" className="app-nav-toggle" aria-expanded={menu} aria-controls="menu-principal" onClick={() => setMenu((v) => !v)}>
            {atual} <IconChevronDown width={14} height={14} />
          </button>
          <nav id="menu-principal" className={`app-nav${menu ? ' is-open' : ''}`} aria-label="Principal">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={caminho === n.href ? 'page' : undefined}>{n.rotulo}</Link>
            ))}
          </nav>
        </div>
        <div className="app-tools">
          <Busca />
        </div>
      </header>
      <nav className="bottom-nav" aria-label="Atalhos">
        <Link href="/" aria-current={caminho === '/' ? 'page' : undefined}><IconHome />Início</Link>
        <Link href="/buscar" aria-current={caminho === '/buscar' ? 'page' : undefined}><IconSearch />Buscar</Link>
        <Link href="/secao/slides" aria-current={caminho === '/secao/slides' ? 'page' : undefined}><IconFilm />Slides</Link>
        <Link href="/minha-lista" aria-current={caminho === '/minha-lista' ? 'page' : undefined}><IconList />Minha lista</Link>
      </nav>
    </>
  );
}
