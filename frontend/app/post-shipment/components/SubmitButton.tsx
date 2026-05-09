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
    <div className="mt-8" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.6s" }}>
      {submitError && (
        <p style={{ fontSize: "13px", color: "#ef4444", textAlign: "center", marginBottom: "12px" }}>{submitError}</p>
      )}
      <button
        onClick={onPublish}
        disabled={!isAlgeria || isLoading}
        className={`w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${isAlgeria && !isLoading ? "bg-[#7C3AED] hover:bg-[#6D28D9] text-white cursor-pointer hover:-translate-y-0.5 hover:shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
        style={{ opacity: isLoading ? 0.7 : 1 }}
      >
        <img src="/icons/publish.png" alt="Publish" style={{ width: "20px", height: "20px", objectFit: "contain" }} />
        {isLoading ? t.publishing : t.publishShipment}
      </button>
      <p className="text-center text-sm text-gray-500 mt-3">
        {t.publishNote}{" "}
        <a href="/terms" className="text-[#7C3AED] underline">{t.termsConditions}</a>
      </p>
    </div>
  )
}
