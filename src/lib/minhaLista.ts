'use client';

// "Minha lista" fica salva no próprio navegador do professor (sem login).
import { useCallback, useEffect, useState } from 'react';

const CHAVE = 'filsoc:minha-lista';
const EVENTO = 'filsoc:minha-lista';

function ler(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? '[]');
    return Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function gravar(lista: string[]) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch {
    /* navegador sem armazenamento (aba anônima): a lista vale só nesta visita */
  }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: lista }));
}

export function useMinhaLista() {
  const [lista, setLista] = useState<string[]>([]);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    setLista(ler());
    setPronta(true);
    const atualizar = (e: Event) => setLista((e as CustomEvent<string[]>).detail ?? ler());
    const outraAba = (e: StorageEvent) => { if (e.key === CHAVE) setLista(ler()); };
    window.addEventListener(EVENTO, atualizar);
    window.addEventListener('storage', outraAba);
    return () => {
      window.removeEventListener(EVENTO, atualizar);
      window.removeEventListener('storage', outraAba);
    };
  }, []);

  const alternar = useCallback((slug: string) => {
    const atual = ler();
    gravar(atual.includes(slug) ? atual.filter((s) => s !== slug) : [slug, ...atual]);
  }, []);

  return { lista, pronta, tem: (slug: string) => lista.includes(slug), alternar };
}
