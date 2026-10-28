import { destaques, fileirasInicio } from '@/lib/catalogo';
import { HeroBanner } from '@/components/HeroBanner';
import { Rail } from '@/components/Rail';
import { TitleCard } from '@/components/TitleCard';
import { MinhaListaRail } from '@/components/MinhaLista';

const VER_TUDO: Record<string, string> = {
  filosofia: '/secao/filosofia', sociologia: '/secao/sociologia', documentarios: '/secao/documentarios', slides: '/secao/slides',
};

export default function Inicio() {
  const fileiras = fileirasInicio();
  return (
    <>
      <HeroBanner itens={destaques()} />
      <div className="rails">
        {fileiras.slice(0, 1).map((f) => (
          <Rail key={f.slug} id={f.slug} title={f.nome} top>
            {f.itens.map((t, i) => <TitleCard key={t.slug} item={t} rank={i + 1} />)}
          </Rail>
        ))}
        <MinhaListaRail />
        {fileiras.slice(1).map((f) => (
          <Rail key={f.slug} id={f.slug} title={f.nome} href={VER_TUDO[f.slug]}>
            {f.itens.map((t) => <TitleCard key={t.slug} item={t} />)}
          </Rail>
        ))}
      </div>
    </>
  );
}
