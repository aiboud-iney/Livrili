import type { Translations } from "../translations"

type Props = {
  t:        Translations
  visible:  boolean
  notes:    string
  onChange: (v: string) => void
}

export function NotesSection({ t, visible, notes, onChange }: Props) {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s",
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#B8FF00", color: "#111" }}>4</div>
        <h2 className="text-xl font-semibold text-gray-900">
          {t.notes}{" "}
          <span className="text-gray-400 font-normal text-base">{t.optional}</span>
        </h2>
      </div>
      <label htmlFor="notes" className="sr-only">{t.notes}</label>
      <textarea
        id="notes"
        name="notes"
        title="Additional Notes"
        placeholder={t.notesPlaceholder}
        rows={3}
        maxLength={500}
        value={notes}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none resize-none"
        style={{ backgroundColor: "#EDFFD0", border: "none" }}
        aria-label={t.notes}
      />
    </div>
  )
}
