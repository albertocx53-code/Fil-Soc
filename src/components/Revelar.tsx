'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Faz cada bloco com a classe "reveal" entrar em cena quando aparece na tela
 * (as fileiras sobem e os cartões chegam um atrás do outro).
 * Sem JavaScript, ou com "reduzir movimento", tudo já aparece normalmente.
 */
export function Revelar() {
  const caminho = usePathname();

  useEffect(() => {
    document.documentElement.dataset.revelar = '1';
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const observar = (raiz: ParentNode) => raiz.querySelectorAll('.reveal:not(.is-in)').forEach((el) => io.observe(el));
    observar(document);
    const mo = new MutationObserver((muds) => {
      for (const m of muds) m.addedNodes.forEach((n) => {
        if (n instanceof HTMLElement) {
          if (n.matches('.reveal:not(.is-in)')) io.observe(n);
          observar(n);
        }
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [caminho]);

  return null;
}
