'use client';

import Link from 'next/link';
import { useMinhaLista } from '@/lib/minhaLista';
import { todos } from '@/lib/catalogo';
import { Rail } from './Rail';
import { TitleCard } from './TitleCard';

/** Fileira "Minha lista" na tela inicial (aparece só quando há itens salvos). */
export function MinhaListaRail() {
  const { lista, pronta } = useMinhaLista();
  if (!pronta || lista.length === 0) return null;
  const mapa = new Map(todos().map((t) => [t.slug, t]));
  const itens = lista.map((s) => mapa.get(s)).filter((t) => !!t);
  if (!itens.length) return null;
  return (
    <Rail id="minha-lista" title="Minha lista" href="/minha-lista">
      {itens.map((t) => <TitleCard key={t!.slug} item={t!} />)}
    </Rail>
  );
}

export function MinhaListaPagina() {
  const { lista, pronta } = useMinhaLista();
  const mapa = new Map(todos().map((t) => [t.slug, t]));
  const itens = lista.map((s) => mapa.get(s)).filter((t) => !!t);
  if (!pronta) return <div className="grid" aria-busy="true" />;
  if (!itens.length) {
    return (
      <div className="empty">
        <h2>Sua lista está vazia</h2>
        <p>Toque no + de qualquer filme para guardar aqui. A lista fica salva neste navegador.</p>
        <Link href="/" className="btn btn--white">Ver o catálogo</Link>
      </div>
    );
  }
  return (
    <div className="grid reveal" style={{ paddingBottom: 60 }}>
      {itens.map((t) => <TitleCard key={t!.slug} item={t!} />)}
    </div>
  );
}
