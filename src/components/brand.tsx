import Link from 'next/link';

export function Logo({ size = 'md', href }: { size?: 'sm' | 'md' | 'xl'; href?: string }) {
  const cls = `logo${size === 'xl' ? ' logo--xl' : size === 'sm' ? ' logo--sm' : ''}`;
  const marca = (
    <span className={cls} aria-label="Fil&Soc">
      <span className="logo-a">FIL</span><span className="logo-amp">&amp;</span><span className="logo-b">SOC</span>
    </span>
  );
  return href ? <Link href={href} className="logo-link" aria-label="Fil&Soc, início">{marca}</Link> : marca;
}

export const SLOGAN = 'O cinema transforma. O conhecimento permanece.';

export function Rodape() {
  return (
    <footer className="site-footer">
      <div className="inner">
        <div className="footer-top">
          <Logo size="sm" />
          <div className="slogan">{SLOGAN}</div>
        </div>
        <nav aria-label="Rodapé">
          <Link href="/">Início</Link>
          <Link href="/secao/filmes">Filmes</Link>
          <Link href="/secao/documentarios">Documentários</Link>
          <Link href="/secao/slides">Slides</Link>
          <Link href="/minha-lista">Minha lista</Link>
          <Link href="/buscar">Pesquisar</Link>
        </nav>
        <p>© {new Date().getFullYear()} Fil&amp;Soc. Os filmes citados pertencem aos seus titulares. Conteúdo pedagógico para uso dos professores.</p>
      </div>
    </footer>
  );
}
