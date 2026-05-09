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
        <div className="w-7 h-7 bg-[#7C3AED] rounded-full flex items-center justify-center text-white text-sm font-medium">4</div>
        <h2 className="text-xl font-semibold text-gray-900">
          {t.notes}{" "}
          <span className="text-gray-400 font-normal text-base">{t.optional}</span>
        </h2>
      </div>
      <textarea
        title="Additional Notes"
        placeholder={t.notesPlaceholder}
        rows={3}
        maxLength={500}
        value={notes}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-[#F3EAFF] rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] resize-none"
      />
    </div>
  )
}
