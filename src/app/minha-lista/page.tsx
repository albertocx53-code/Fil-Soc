import type { Metadata } from 'next';
import { MinhaListaPagina } from '@/components/MinhaLista';

export const metadata: Metadata = { title: 'Minha lista' };

export default function MinhaLista() {
  return (
    <>
      <div className="section-head">
        <h1>Minha lista</h1>
        <p>O que você guardou para as próximas aulas. Fica salvo neste navegador.</p>
      </div>
      <MinhaListaPagina />
    </>
  );
}
