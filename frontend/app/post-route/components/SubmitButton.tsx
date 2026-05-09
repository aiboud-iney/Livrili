import type { Translations } from "../translations"

type Props = {
  t:           Translations
  visible:     boolean
  isAlgeria:   boolean
  isLoading:   boolean
  submitError: string
  onPublish:   () => void
}

export function SubmitButton({ t, visible, isAlgeria, isLoading, submitError, onPublish }: Props) {
  return (
    <div className="mt-8" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.5s" }}>
      {submitError && (
        <p style={{ fontSize: "13px", color: "#ef4444", textAlign: "center", marginBottom: "12px" }}>{submitError}</p>
      )}
      <button
        onClick={onPublish}
        disabled={!isAlgeria || isLoading}
        className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isAlgeria && !isLoading ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg" : "cursor-not-allowed"}`}
        style={{ backgroundColor: isAlgeria ? "#B8FF00" : "#e5e7eb", color: isAlgeria ? "#111" : "#9ca3af", fontSize: "16px", fontWeight: 700, border: "none", opacity: isLoading ? 0.7 : 1 }}
      >
        <img src="/icons/publish green.png" alt="Publish" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
        {isLoading ? t.publishing : t.publishRoute}
      </button>
      <p className="text-center text-sm text-gray-500 mt-3">
        {t.publishNote}{" "}
        <a href="/terms" style={{ color: "#B8FF00", textDecoration: "underline" }}>{t.termsConditions}</a>
      </p>
    </div>
  )
}
