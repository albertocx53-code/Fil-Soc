import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { secao, SECOES, type SecaoSlug } from '@/lib/catalogo';
import { Rail } from '@/components/Rail';
import { TitleCard } from '@/components/TitleCard';
import { IconClapper } from '@/components/icons';

export function generateStaticParams() {
  return Object.keys(SECOES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: SECOES[slug as SecaoSlug]?.nome ?? 'Catálogo' };
}

export default async function Secao({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!Object.hasOwn(SECOES, slug)) notFound();
  const s = secao(slug as SecaoSlug);

  return (
    <>
      <div className="section-head">
        <h1>{s.nome}</h1>
        <p>{s.texto}</p>
      </div>
      {s.itens.length === 0 ? (
        <div className="empty">
          <IconClapper />
          <h2>Em breve</h2>
          <p>Os conteúdos desta seção estão sendo preparados e aparecem aqui assim que forem publicados.</p>
          <Link href="/" className="btn btn--white">Voltar ao início</Link>
        </div>
      ) : (
        <>
          <div className="grid reveal" style={{ paddingBottom: 40 }}>
            {s.itens.map((t) => <TitleCard key={t.slug} item={t} />)}
          </div>
          {s.temas.length > 1 && (
            <div className="rails rails--flat">
              {s.temas.map((f) => (
                <Rail key={f.slug} id={`${slug}-${f.slug}`} title={f.nome}>
                  {f.itens.map((t) => <TitleCard key={t.slug} item={t} />)}
                </Rail>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
