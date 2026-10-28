import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Busca } from './Busca';

export const metadata: Metadata = { title: 'Pesquisa' };

export default function Pesquisa() {
  return (
    <>
      <div className="section-head">
        <h1>Pesquisa</h1>
        <p>Busque por filme, diretor, filósofo, sociólogo, conceito ou tema.</p>
      </div>
      <Suspense fallback={<div className="grid" aria-busy="true" />}>
        <Busca />
      </Suspense>
    </>
  );
}
