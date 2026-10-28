import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DISCIPLINA, duracao, linkIncorporavel, porSlug, relacionados, temasDo, TIPO, todos, type Link as L } from '@/lib/catalogo';
import { TitleArt } from '@/components/TitleArt';
import { FavoriteButton, ShareButton } from '@/components/ui';
import { Rail } from '@/components/Rail';
import { TitleCard } from '@/components/TitleCard';
import { IconBook, IconCheck, IconExternal, IconFilm, IconPlay } from '@/components/icons';

export function generateStaticParams() {
  return todos().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = porSlug(slug);
  return t ? { title: t.titulo, description: t.sinopse.slice(0, 160) } : { title: 'Título não encontrado' };
}

function Incorporado({ item, tipo }: { item: L; tipo: 'slides' | 'video' }) {
  const src = linkIncorporavel(item.url);
  return (
    <figure className="embed">
      {src ? (
        <div className={`embed-frame${tipo === 'slides' ? ' embed-frame--slides' : ''}`}>
          <iframe src={src} title={item.titulo} loading="lazy" allow="fullscreen; autoplay; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      ) : null}
      <figcaption>
        <span>{item.titulo}</span>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost"><IconExternal /> {src ? 'Abrir em tela cheia' : 'Abrir'}</a>
      </figcaption>
    </figure>
  );
}

export default async function TituloPagina({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = porSlug(slug);
  if (!t) notFound();
  const g = t.ficha;
  const pensadores = temasDo(t, 'pensador');
  const outros = relacionados(t);

  return (
    <>
      <section className="title-hero">
        <div className="hero-bg">
          <TitleArt title={t.titulo} art={t.arte} seed={t.slug} imageUrl={t.banner ?? t.capa} variant="fill" showText={false} />
        </div>
        <div className="hero-ghost" aria-hidden="true">{t.titulo.charAt(0)}</div>
        <div className="hero-shade" />
        <div className="dust" aria-hidden="true">{Array.from({ length: 8 }, (_, k) => <i key={k} />)}</div>
        <div className="title-hero-inner">
          <div className="title-hero-text">
            <div className="hero-kicker"><i />{TIPO[t.tipo]}{t.disciplinas.length ? ` de ${t.disciplinas.map((d) => DISCIPLINA[d] ?? d).join(' e ')}` : ''}</div>
            <h1 className="hero-title">
              {t.titulo.split(' ').map((p, k, a) => (
                <Fragment key={k}><span className="w"><span style={{ '--i': String(k) } as CSSProperties}>{p}</span></span>{k < a.length - 1 ? ' ' : ''}</Fragment>
              ))}
            </h1>
            {t.tituloOriginal && t.tituloOriginal !== t.titulo && <p className="orig">Título original: {t.tituloOriginal}</p>}
            <div className="meta hero-meta">
              {t.ano && <span>{t.ano}</span>}
              {t.duracao && <span>{duracao(t.duracao)}</span>}
              {t.pais && <span>{t.pais}</span>}
              {t.slides.length > 0 && <span className="badge badge--red">Com slides</span>}
              {g && <span className="badge">Ficha pedagógica</span>}
            </div>
            {t.chamada && <p className="title-tagline">{t.chamada}</p>}
            <p className="lead">{t.sinopse}</p>
            <div className="hero-actions">
              {t.slides.length > 0 && <a href="#slides" className="btn btn--red btn--lg"><IconPlay /> Ver slides</a>}
              {g && <a href="#sala-de-aula" className={`btn btn--lg ${t.slides.length ? 'btn--glass' : 'btn--red'}`}><IconBook /> Explore em sala de aula</a>}
              {!t.slides.length && t.ondeAssistir.length > 0 && <a href="#onde-assistir" className="btn btn--glass btn--lg"><IconExternal /> Onde assistir</a>}
              <FavoriteButton slug={t.slug} titulo={t.titulo} variante="botao" />
              <ShareButton titulo={t.titulo} />
            </div>
          </div>
          <div className="hero-poster hero-poster--static" aria-hidden="true">
            <TitleArt title={t.titulo} art={t.arte} seed={t.slug} imageUrl={t.capa} />
            <span className="hero-poster-glare" />
          </div>
        </div>
      </section>

      <div className="page">
        <dl className="facts reveal">
          {t.direcao.length > 0 && <div className="fact"><dt>Direção</dt><dd>{t.direcao.join(', ')}</dd></div>}
          {t.elenco.length > 0 && <div className="fact"><dt>{t.tipo === 'documentario' ? 'Participação' : 'Elenco'}</dt><dd>{t.elenco.join(', ')}</dd></div>}
          {t.generos.length > 0 && <div className="fact"><dt>Gênero</dt><dd>{t.generos.join(', ')}</dd></div>}
          {t.idiomas.length > 0 && <div className="fact"><dt>Idioma original</dt><dd>{t.idiomas.join(', ')}</dd></div>}
          <div className="fact"><dt>Disciplinas</dt><dd>{t.disciplinas.map((d) => DISCIPLINA[d] ?? d).join(' e ')}</dd></div>
          {t.faixa.length > 0 && <div className="fact"><dt>Faixa escolar</dt><dd>{t.faixa.join(', ')}</dd></div>}
          <div className="fact"><dt>Classificação indicativa</dt><dd>Confira no site oficial do ClassInd antes de exibir</dd></div>
        </dl>

        {t.slides.length > 0 && (
          <section className="block reveal" id="slides" aria-labelledby="slides-t">
            <h3 id="slides-t">Slides da aula</h3>
            <div className="embeds">{t.slides.map((s) => <Incorporado key={s.url} item={s} tipo="slides" />)}</div>
          </section>
        )}

        {t.videos.length > 0 && (
          <section className="block reveal" id="videos" aria-labelledby="videos-t">
            <h3 id="videos-t">Vídeos</h3>
            <div className="embeds">{t.videos.map((v) => <Incorporado key={v.url} item={v} tipo="video" />)}</div>
          </section>
        )}

        {t.materiais.length > 0 && (
          <section className="block reveal" id="materiais" aria-labelledby="materiais-t">
            <h3 id="materiais-t">Materiais para baixar</h3>
            <div className="cards-2">
              {t.materiais.map((m) => (
                <a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer" className="panel panel--link">
                  <h4>{m.titulo}</h4>
                  <p>{m.formato ? `${m.formato.toUpperCase()} · ` : ''}Abrir ou baixar</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {t.ondeAssistir.length > 0 && (
          <div className="availability reveal" id="onde-assistir">
            <IconFilm />
            <p><strong>Onde assistir ao filme:</strong> consulte os serviços de streaming e locação onde ele está disponível no momento.</p>
            {t.ondeAssistir.map((s) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost"><IconExternal /> {s.rotulo}</a>
            ))}
          </div>
        )}

        {g && (
          <section className="classroom" id="sala-de-aula" aria-labelledby="sala-titulo">
            <div className="classroom-head reveal">
              <p className="eyebrow" style={{ justifySelf: 'start' }}>Ficha pedagógica</p>
              <h2 id="sala-titulo">Explore este filme em sala de aula</h2>
              <p>{g.porQue}</p>
              <nav className="toc" aria-label="Seções da ficha">
                <a href="#objetivos">Objetivos</a>
                <a href="#conceitos">Conceitos e pensadores</a>
                <a href="#debate">Perguntas para debate</a>
                <a href="#plano">Plano de aula</a>
                {g.roteiro.length > 0 && <a href="#roteiro">Roteiro de análise</a>}
                {g.atividades.length > 0 && <a href="#atividades">Atividades</a>}
                {g.referencias.length > 0 && <a href="#referencias">Referências</a>}
              </nav>
            </div>

            <div className="two-col reveal">
              <div className="block" id="objetivos">
                <h3>Objetivos de aprendizagem</h3>
                <ul className="checklist">{g.objetivos.map((o) => <li key={o}><IconCheck />{o}</li>)}</ul>
              </div>
              <div className="block" id="conceitos">
                <h3>Conceitos e pensadores</h3>
                <div className="chips" style={{ marginBottom: 14 }}>
                  {g.conceitos.map((c) => <Link key={c} href={`/buscar?q=${encodeURIComponent(c)}`} className="chip">{c}</Link>)}
                </div>
                <div className="chips">
                  {(pensadores.length ? pensadores.map((c) => c.nome) : g.pensadores).map((n) => (
                    <Link key={n} href={`/buscar?q=${encodeURIComponent(n)}`} className="chip chip--gold">{n}</Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="block reveal" id="debate">
              <h3>Perguntas para debate</h3>
              <div className="questions">{g.perguntas.map((q) => <div key={q} className="question">{q}</div>)}</div>
            </div>

            <div className="block reveal" id="plano">
              <h3>Plano de aula</h3>
              <ol className="timeline">
                {g.plano.map((s) => (
                  <li key={s.etapa}><span className="when">{s.tempo}</span><div className="what"><strong>{s.etapa}</strong><p>{s.descricao}</p></div></li>
                ))}
              </ol>
            </div>

            {g.roteiro.length > 0 && (
              <div className="block reveal" id="roteiro">
                <h3>Roteiro de análise cinematográfica</h3>
                <div className="cards-2">{g.roteiro.map((a) => <div key={a.momento} className="panel"><h4>{a.momento}</h4><p>{a.observar}</p></div>)}</div>
              </div>
            )}

            {g.atividades.length > 0 && (
              <div className="block reveal" id="atividades">
                <h3>Atividades</h3>
                <div className="cards-2">{g.atividades.map((a) => <div key={a.nome} className="panel"><h4>{a.nome}</h4><p>{a.descricao}</p></div>)}</div>
              </div>
            )}

            <div className="two-col reveal">
              {g.dicas.length > 0 && (
                <div className="block">
                  <h3>Sugestões de abordagem</h3>
                  <ul className="checklist">{g.dicas.map((d) => <li key={d}><IconCheck />{d}</li>)}</ul>
                </div>
              )}
              {g.referencias.length > 0 && (
                <div className="block" id="referencias">
                  <h3>Referências</h3>
                  <ul className="refs">{g.referencias.map((r) => <li key={r}>{r}</li>)}</ul>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      {outros.length > 0 && (
        <div className="rails rails--flat" style={{ marginTop: 56 }}>
          <Rail id="relacionados" title="Para continuar a conversa">
            {outros.map((o) => <TitleCard key={o.slug} item={o} />)}
          </Rail>
        </div>
      )}
    </>
  );
}
