import Link from 'next/link';
import { duracao, TIPO, type Titulo } from '@/lib/catalogo';
import { TitleArt } from './TitleArt';
import { FavoriteButton } from './ui';
import { IconChevronDown, IconPlay } from './icons';

function Cartao({ item }: { item: Titulo }) {
  const href = `/titulo/${item.slug}`;
  const play = item.slides.length > 0 ? `${href}#slides` : item.ficha ? `${href}#sala-de-aula` : href;
  return (
    <article className="card">
      <div className="thumb">
        <Link href={href} className="thumb-link" aria-label={`${item.titulo}${item.ano ? ` (${item.ano})` : ''}`}>
          <TitleArt title={item.titulo} art={item.arte} seed={item.slug} imageUrl={item.capa} />
        </Link>
        {item.slides.length > 0 && <span className="tag-slides" aria-hidden="true">Com slides</span>}
        <div className="shade" aria-hidden="true" />
        <div className="cap">
          <strong>{item.titulo}</strong>
          <div className="cap-meta">
            {item.ano && <span>{item.ano}</span>}
            {item.duracao && <span>{duracao(item.duracao)}</span>}
            <span className="badge">{TIPO[item.tipo]}</span>
          </div>
          <div className="cap-btns">
            <Link href={play} className="ic ic--play" aria-label={item.slides.length ? `Ver slides de ${item.titulo}` : `Abrir ${item.titulo}`}><IconPlay /></Link>
            <FavoriteButton slug={item.slug} titulo={item.titulo} variante="icone-p" />
            <Link href={href} className="ic push" aria-label={`Detalhes de ${item.titulo}`}><IconChevronDown /></Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export function TitleCard({ item, rank }: { item: Titulo; rank?: number }) {
  if (!rank) return <Cartao item={item} />;
  return (
    <div className="top-item">
      <span className="rank" aria-hidden="true">{rank}</span>
      <Cartao item={item} />
    </div>
  );
}
