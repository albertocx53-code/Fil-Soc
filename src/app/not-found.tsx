import Link from 'next/link';

export default function NaoEncontrado() {
  return (
    <div className="error-page">
      <div>
        <div className="code" aria-hidden="true">404</div>
        <h1>Esta cena foi cortada na edição</h1>
        <p>A página que você procura não existe ou mudou de endereço.</p>
        <Link href="/" className="btn btn--white btn--lg">Voltar ao catálogo</Link>
      </div>
    </div>
  );
}
