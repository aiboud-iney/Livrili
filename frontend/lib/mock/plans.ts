export type BillingCycle = "monthly" | "yearly";

export interface Plan {
  id: string;
  name: { en: string; fr: string };
  price: { monthly: number; yearly: number };
  badge?: { en: string; fr: string };
  tagline: { en: string; fr: string };
  features: Array<{
    text: { en: string; fr: string };
    included: boolean;
  }>;
  highlighted: boolean;
  ctaLabel: { en: string; fr: string };
}

export interface FAQItem {
  question: { en: string; fr: string };
  answer: { en: string; fr: string };
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: { en: "Free", fr: "Gratuit" },
    price: { monthly: 0, yearly: 0 },
    tagline: {
      en: "Get started with basic features",
      fr: "Commencez avec les fonctionnalités de base",
    },
    features: [
      {
        text: { en: "Up to 5 combined posts", fr: "Jusqu'à 5 annonces combinées" },
        included: true,
      },
      {
        text: { en: "Basic search & browse", fr: "Recherche et navigation de base" },
        included: true,
      },
      {
        text: { en: "Email support", fr: "Support par email" },
        included: true,
      },
      {
        text: { en: "Live GPS tracking", fr: "Suivi GPS en direct" },
        included: false,
      },
      {
        text: { en: "Analytics dashboard", fr: "Tableau de bord analytique" },
        included: false,
      },
      {
        text: { en: "Priority support", fr: "Support prioritaire" },
        included: false,
      },
    ],
    highlighted: false,
    ctaLabel: { en: "Get Started Free", fr: "Commencer Gratuitement" },
  },
  {
    id: "premium",
    name: { en: "Premium", fr: "Premium" },
    price: { monthly: 60000, yearly: 600000 },
    badge: { en: "RECOMMENDED", fr: "RECOMMANDÉ" },
    tagline: {
      en: "For growing businesses that need more",
      fr: "Pour les entreprises en croissance qui ont besoin de plus",
    },
    features: [
      {
        text: { en: "Unlimited posts (shipments + routes)", fr: "Annonces illimitées (envois + routes)" },
        included: true,
      },
      {
        text: { en: "Live GPS tracking", fr: "Suivi GPS en temps réel" },
        included: true,
      },
      {
        text: { en: "Analytics dashboard", fr: "Tableau de bord analytique" },
        included: true,
      },
      {
        text: { en: "Priority support", fr: "Support prioritaire" },
        included: true,
      },
      {
        text: { en: "Advanced filters & matching", fr: "Filtres avancés et correspondance" },
        included: true,
      },
      {
        text: { en: "Full access to premium features", fr: "Accès complet aux fonctionnalités premium" },
        included: true,
      },
    ],
    highlighted: true,
    ctaLabel: { en: "Subscribe Now", fr: "S'abonner Maintenant" },
  },
];

export const CURRENT_USER_PLAN = {
  planId: "free",
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: {
      en: "What is Livrili?",
      fr: "Qu'est-ce que Livrili ?",
    },
    answer: {
      en: "Livrili is a logistics marketplace that connects shippers with carriers to optimize freight transport across Algeria.",
      fr: "Livrili est une plateforme logistique qui connecte les expéditeurs avec les transporteurs pour optimiser le transport de marchandises à travers l'Algérie.",
    },
  },
  {
    question: {
      en: "How does the Free plan work?",
      fr: "Comment fonctionne le plan Gratuit ?",
    },
    answer: {
      en: "The Free plan allows you to post up to 5 combined shipments and routes. You can browse and search available loads and trucks at no cost.",
      fr: "Le plan Gratuit vous permet de publier jusqu'à 5 expéditions et routes combinées. Vous pouvez parcourir et rechercher des chargements et camions disponibles gratuitement.",
    },
  },
  {
    question: {
      en: "What is included in the Premium plan?",
      fr: "Qu'est-ce qui est inclus dans le plan Premium ?",
    },
    answer: {
      en: "Premium gives you unlimited posts, live GPS tracking, analytics dashboard, advanced filters, and priority support. Monthly: 60,000 DA. Yearly: 50,000 DA/month billed annually (save 17%).",
      fr: "Premium vous offre des annonces illimitées, le suivi GPS en direct, un tableau de bord analytique, des filtres avancés et un support prioritaire. Mensuel : 60 000 DA. Annuel : 50 000 DA/mois facturé annuellement (économisez 17%).",
    },
  },
  {
    question: {
      en: "What payment methods do you accept?",
      fr: "Quels moyens de paiement acceptez-vous ?",
    },
    answer: {
      en: "We accept Baridi Mob, Bank Transfer (WimPay), and Algérie Poste (CCP). Simply upload your payment receipt and our team will verify it.",
      fr: "Nous acceptons Baridi Mob, Virement bancaire (WimPay) et Algérie Poste (CCP). Téléchargez simplement votre reçu de paiement et notre équipe le vérifiera.",
    },
  },
  {
    question: {
      en: "How do I get verified as a carrier?",
      fr: "Comment être vérifié en tant que transporteur ?",
    },
    answer: {
      en: "Go to your profile settings and submit your business documents (trade register, tax ID). An admin will review and verify your account within 24-48 hours.",
      fr: "Allez dans les paramètres de votre profil et soumettez vos documents commerciaux (registre de commerce, NIF). Un administrateur examinera et vérifiera votre compte sous 24 à 48 heures.",
    },
  },
  {
    question: {
      en: "Can I cancel my subscription?",
      fr: "Puis-je annuler mon abonnement ?",
    },
    answer: {
      en: "Yes, you can cancel anytime. Your access will remain active until the end of the current billing period.",
      fr: "Oui, vous pouvez annuler à tout moment. Votre accès restera actif jusqu'à la fin de la période de facturation en cours.",
    },
  },
];
