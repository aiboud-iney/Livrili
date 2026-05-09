export interface PaymentMethod {
  id: string;
  icon: "baridi" | "bank" | "poste";
  name: { en: string; fr: string };
  details: { en: string; fr: string };
  subDetails?: { en: string; fr: string };
  copyValue: string;
}

export interface HowItWorksStep {
  en: { title: string; desc: string };
  fr: { title: string; desc: string };
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "baridi-mob",
    icon: "baridi",
    name: { en: "Baridi Mob", fr: "Baridi Mob" },
    details: {
      en: "+213 555 12 34 567",
      fr: "+213 555 12 34 567",
    },
    subDetails: {
      en: "Mohamed Ahmed",
      fr: "Mohamed Ahmed",
    },
    copyValue: "+2135551234567",
  },
  {
    id: "bank-transfer",
    icon: "bank",
    name: {
      en: "Bank Transfer (WimPay)",
      fr: "Virement bancaire (WimPay)",
    },
    details: {
      en: "CPA — Compte 123 456 789 01",
      fr: "CPA — Compte 123 456 789 01",
    },
    subDetails: {
      en: "Livrili Logistics Solutions",
      fr: "Livrili Logistics Solutions",
    },
    copyValue: "12345678901",
  },
  {
    id: "ccp",
    icon: "poste",
    name: {
      en: "Algérie Poste (CCP)",
      fr: "Algérie Poste (CCP)",
    },
    details: {
      en: "CCP N° 123 456 78 90",
      fr: "CCP N° 123 456 78 90",
    },
    subDetails: {
      en: "Key: 123 456",
      fr: "Clé : 123 456",
    },
    copyValue: "1234567890",
  },
];

export const WHAT_HAPPENS_NEXT: HowItWorksStep[] = [
  {
    en: {
      title: "Submit Payment",
      desc: "Upload your payment receipt and our system will securely store it for verification.",
    },
    fr: {
      title: "Soumettre le paiement",
      desc: "Téléchargez votre reçu de paiement et notre système le stockera en toute sécurité pour vérification.",
    },
  },
  {
    en: {
      title: "Admin Verification",
      desc: "Our team reviews your payment details within 24-48 hours to ensure everything is correct.",
    },
    fr: {
      title: "Vérification administrative",
      desc: "Notre équipe examine vos détails de paiement dans les 24 à 48 heures pour s'assurer que tout est correct.",
    },
  },
  {
    en: {
      title: "Account Activated",
      desc: "Once verified, your Premium features will be unlocked immediately. You'll receive a confirmation email.",
    },
    fr: {
      title: "Compte activé",
      desc: "Une fois vérifié, vos fonctionnalités Premium seront débloquées immédiatement. Vous recevrez un email de confirmation.",
    },
  },
];
