const stats = [
  { value: "[XX,000]+", label: "notas generadas por estudiantes" },
  { value: "[XX]%", label: "de respuestas marcadas como útiles" },
  { value: "<[X]s", label: "tiempo medio de respuesta" },
];

export function Stats() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 sm:divide-x divide-border/60 text-center">
          {stats.map((s) => (
            <div key={s.label} className="px-6">
              <div className="font-serif text-4xl md:text-5xl tracking-tight">{s.value}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-10 text-xs italic text-muted-foreground/60">
          Reemplaza estos números por tus métricas reales antes de publicar
        </p>
      </div>
    </section>
  );
}
