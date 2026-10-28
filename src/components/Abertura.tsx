'use client';

import { useEffect, useState, type CSSProperties } from 'react';

// Feixes de luz da abertura. Gerados com semente fixa para o HTML do servidor e o do
// navegador saírem idênticos.
function feixes() {
  let s = 20250;
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const cores = ['#ff2d2d', '#e0372c', '#ff5a36', '#ff7b6b', '#b3121a', '#ff3d5e', '#ffb43a', '#ff2d55'];
  return Array.from({ length: 42 }, (_, i) => ({
    '--w': `${(1 + r() * 7).toFixed(1)}px`,
    '--h': `${(35 + r() * 80).toFixed(0)}vh`,
    '--c': cores[i % cores.length],
    '--x': `${((r() * 2 - 1) * 60).toFixed(1)}vw`,
    '--d': `${(0.9 + r() * 0.7).toFixed(2)}s`,
    '--t': `${(1.45 + r() * 0.5).toFixed(2)}s`,
    marginLeft: `${((r() * 2 - 1) * 9).toFixed(1)}vw`,
  })) as CSSProperties[];
}
const FEIXES = feixes();
const LETRAS = ['F', 'I', 'L', '&', 'S', 'O', 'C'];

/** Abertura de cinema: o logo se monta, brilha, os feixes explodem e a câmera "entra" no catálogo. */
export function Abertura() {
  const [viva, setViva] = useState(true);

  useEffect(() => {
    const raiz = document.documentElement;
    if (!raiz.classList.contains('com-abertura')) { setViva(false); return; }
    const fim = () => {
      raiz.classList.remove('com-abertura');
      raiz.classList.add('abertura-fim');
      setViva(false);
    };
    const t = setTimeout(fim, 4000);
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') fim(); };
    document.addEventListener('keydown', tecla);
    (window as unknown as { __pularAbertura?: () => void }).__pularAbertura = fim;
    return () => { clearTimeout(t); document.removeEventListener('keydown', tecla); };
  }, []);

  if (!viva) return null;
  return (
    <div
      id="abertura"
      className="abertura"
      aria-hidden="true"
      onClick={() => (window as unknown as { __pularAbertura?: () => void }).__pularAbertura?.()}
    >
      <div className="ab-brilho" />
      <div className="ab-feixes">{FEIXES.map((st, i) => <i key={i} style={st} />)}</div>
      <div className="ab-palco">
        <div className="ab-marca">
          {LETRAS.map((l, i) => (
            <span key={i} className={l === '&' ? 'amp' : undefined} style={{ '--i': String(i) } as CSSProperties}>{l}</span>
          ))}
          <b className="ab-reflexo" />
        </div>
        <div className="ab-linha" />
        <p className="ab-slogan">Filmes que viram aulas</p>
      </div>
      <span className="ab-pular">Clique para pular</span>
    </div>
  );
}
