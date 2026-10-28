'use client';

import { useState } from 'react';
import { useMinhaLista } from '@/lib/minhaLista';
import { IconCheck, IconPlus, IconShare } from './icons';

export function FavoriteButton({ slug, titulo, variante = 'icone' }: { slug: string; titulo: string; variante?: 'icone' | 'icone-p' | 'botao' }) {
  const { tem, alternar, pronta } = useMinhaLista();
  const salvo = pronta && tem(slug);
  const rotulo = salvo ? `Remover ${titulo} da Minha lista` : `Adicionar ${titulo} à Minha lista`;
  if (variante === 'botao') {
    return (
      <button type="button" className="btn btn--glass" onClick={() => alternar(slug)} aria-pressed={salvo} aria-label={rotulo}>
        {salvo ? <IconCheck /> : <IconPlus />}
        {salvo ? 'Na minha lista' : 'Minha lista'}
      </button>
    );
  }
  return (
    <button
      type="button"
      className={`${variante === 'icone-p' ? 'ic' : 'icon-btn'}${salvo ? ' is-on' : ''}`}
      onClick={() => alternar(slug)}
      aria-pressed={salvo}
      aria-label={rotulo}
      title={salvo ? 'Na minha lista' : 'Minha lista'}
    >
      {salvo ? <IconCheck /> : <IconPlus />}
    </button>
  );
}

export function ShareButton({ titulo }: { titulo: string }) {
  const [copiado, setCopiado] = useState(false);
  const compartilhar = async () => {
    const url = window.location.href.split('#')[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: `${titulo} · Fil&Soc`, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      /* cancelado */
    }
  };
  return (
    <button type="button" className="btn btn--glass" onClick={compartilhar} aria-live="polite">
      {copiado ? <IconCheck /> : <IconShare />}
      {copiado ? 'Link copiado' : 'Compartilhar'}
    </button>
  );
}
