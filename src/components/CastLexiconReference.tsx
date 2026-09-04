import { CAST_AXES } from "../data/castLexicon";

type Props = {
  /** One line per axis instead of the full table. */
  compact?: boolean;
  /** Show the Georgian and Russian glosses. */
  showTranslations?: boolean;
};

/**
 * The CAST lexicon rendered from its single source of truth. Used by the
 * Library glossary and by the edge dialog's quick reference.
 */
export function CastLexiconReference({ compact = false, showTranslations = !compact }: Props) {
  return (
    <div data-testid="cast-lexicon-reference" className="grid gap-3 text-sm text-zinc-200">
      {CAST_AXES.map((axis) => (
        <section key={axis.name} className="rounded-md border border-zinc-700 bg-zinc-950/60 p-2">
          <div className="text-xs uppercase tracking-wide text-zinc-400">
            {axis.slot} - {axis.title}
          </div>
          <div className="mt-0.5 text-xs text-zinc-500">{axis.question}</div>
          {compact ? (
            <div className="mt-1 text-xs text-zinc-300">
              {axis.rows.map((row, index) => (
                <span key={row.bits}>
                  {index > 0 ? " · " : ""}
                  {row.bits} {row.english} ({row.gloss})
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-2 overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="text-left text-zinc-500">
                    <th className="pr-2 font-medium">Bits</th>
                    <th className="pr-2 font-medium">Archetype</th>
                    <th className="pr-2 font-medium">Means</th>
                    <th className="pr-2 font-medium">Use when</th>
                    {showTranslations ? <th className="pr-2 font-medium">ქართული</th> : null}
                    {showTranslations ? <th className="font-medium">Русский</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {axis.rows.map((row) => (
                    <tr key={row.bits} className="border-t border-zinc-800 align-top">
                      <td className="py-1 pr-2 font-mono text-zinc-400">{row.bits}</td>
                      <td className="py-1 pr-2 font-medium text-zinc-100">{row.english}</td>
                      <td className="py-1 pr-2 text-zinc-300">
                        {row.gloss}
                        <span className="block text-zinc-500">{row.simpleEnglish}</span>
                      </td>
                      <td className="py-1 pr-2 text-zinc-400">{row.useWhen}</td>
                      {showTranslations ? <td className="py-1 pr-2 text-zinc-400">{row.georgian}</td> : null}
                      {showTranslations ? <td className="py-1 text-zinc-400">{row.russian}</td> : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
