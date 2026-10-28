'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { DISCIPLINA, duracao, TIPO, type Titulo } from '@/lib/catalogo';
import { TitleArt } from './TitleArt';
import { FavoriteButton } from './ui';
import { IconBook, IconInfo, IconPlay } from './icons';

const TEMPO = 9000;

function kicker(t: Titulo) {
  const d = t.disciplinas.map((x) => DISCIPLINA[x] ?? x);
  return `${TIPO[t.tipo] ?? 'Título'}${d.length ? ` de ${d.join(' e ')}` : ''}`;
}

export function HeroBanner({ itens }: { itens: Titulo[] }) {
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);
  const raiz = useRef<HTMLElement>(null);
  const quadro = useRef<number>(0);

  // Quem pediu menos movimento não tem a barra animada; troca por tempo.
  useEffect(() => {
    if (itens.length < 2 || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % itens.length), TEMPO);
    return () => clearInterval(t);
  }, [itens.length]);

  // Paralaxe: o pôster e o fundo acompanham o mouse.
  const mover = (e: MouseEvent<HTMLElement>) => {
    const el = raiz.current;
    if (!el) return;
    cancelAnimationFrame(quadro.current);
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 2 - 1;
    const y = ((e.clientY - top) / height) * 2 - 1;
    quadro.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
    });
  };
  const sair = () => {
    setPausado(false);
    raiz.current?.style.setProperty('--mx', '0');
    raiz.current?.style.setProperty('--my', '0');
  };

  if (!itens.length) return null;
  const proximo = () => setI((n) => (n + 1) % itens.length);

  return (
    <section
      ref={raiz}
      className={`hero${pausado ? ' is-paused' : ''}`}
      aria-roledescription="carrossel"
      aria-label="Destaques"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={sair}
      onMouseMove={mover}
    >
      {itens.map((t, n) => {
        const ativo = n === i;
        const palavras = t.titulo.split(' ');
        return (
          <div key={t.slug} className={`hero-slide${ativo ? ' is-active' : ''}`} aria-hidden={!ativo} inert={!ativo}>
            <div className="hero-bg">
              <TitleArt title={t.titulo} art={t.arte} seed={t.slug} imageUrl={t.banner ?? t.capa} variant="fill" showText={false} />
            </div>
            <div className="hero-ghost" aria-hidden="true">{t.titulo.charAt(0)}</div>
            <div className="hero-shade" />
            <div className="dust" aria-hidden="true">{Array.from({ length: 10 }, (_, k) => <i key={k} />)}</div>
            <Link href={`/titulo/${t.slug}`} className="hero-poster" tabIndex={-1} aria-hidden="true">
              <TitleArt title={t.titulo} art={t.arte} seed={t.slug} imageUrl={t.capa} />
              <span className="hero-poster-glare" />
            </Link>
            <div className="hero-content">
              <div className="hero-kicker"><i />{kicker(t)}</div>
              <h1 className="hero-title">
                {palavras.map((p, k) => (
                  <Fragment key={k}><span className="w"><span style={{ '--i': String(k) } as CSSProperties}>{p}</span></span>{k < palavras.length - 1 ? ' ' : ''}</Fragment>
                ))}
              </h1>
              <div className="meta hero-meta">
                {n === 0 && <span className="novo">Em alta</span>}
                {t.ano && <span>{t.ano}</span>}
                {t.duracao && <span>{duracao(t.duracao)}</span>}
                {t.disciplinas.map((d) => <span key={d} className="badge badge--red">{DISCIPLINA[d] ?? d}</span>)}
                {t.generos.slice(0, 1).map((g) => <span key={g}>{g}</span>)}
              </div>
              <p className="hero-synopsis">{t.sinopse}</p>
              <div className="hero-actions">
                {t.slides.length > 0 ? (
                  <Link href={`/titulo/${t.slug}#slides`} className="btn btn--red btn--lg"><IconPlay /> Ver slides</Link>
                ) : t.ficha ? (
                  <Link href={`/titulo/${t.slug}#sala-de-aula`} className="btn btn--red btn--lg"><IconBook /> Levar para a aula</Link>
                ) : null}
                <Link href={`/titulo/${t.slug}`} className="btn btn--glass btn--lg"><IconInfo /> Mais informações</Link>
                <FavoriteButton slug={t.slug} titulo={t.titulo} />
              </div>
            </div>
          </div>
        );
      })}
      {itens.length > 1 && (
        <div className="hero-dots" role="tablist" aria-label="Escolher destaque">
          {itens.map((t, n) => (
            <button key={t.slug} type="button" role="tab" aria-selected={n === i} aria-label={t.titulo} onClick={() => setI(n)}>
              <i onAnimationEnd={n === i ? proximo : undefined} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
