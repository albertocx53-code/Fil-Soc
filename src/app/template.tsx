// Recriado a cada troca de página: dá a transição de entrada (a tela "acende" e assenta).
export default function Transicao({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
