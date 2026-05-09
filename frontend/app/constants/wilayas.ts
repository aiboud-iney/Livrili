export const WILAYAS = [
  "01 - Adrar",
  "02 - Chlef",
  "03 - Laghouat",
  "04 - Oum el Bouaghi",
  "05 - Batna",
  "06 - Bejaia",
  "07 - Biskra",
  "08 - Bechar",
  "09 - Blida",
  "10 - Bouira",
  "11 - Tamanrasset",
  "12 - Tebessa",
  "13 - Tlemcen",
  "14 - Tiaret",
  "15 - Tizi Ouzou",
  "16 - Alger",
  "17 - Djelfa",
  "18 - Jijel",
  "19 - Setif",
  "20 - Saida",
  "21 - Skikda",
  "22 - Sidi Bel Abbes",
  "23 - Annaba",
  "24 - Guelma",
  "25 - Constantine",
  "26 - Medea",
  "27 - Mostaganem",
  "28 - M'Sila",
  "29 - Mascara",
  "30 - Ouargla",
  "31 - Oran",
  "32 - El Bayadh",
  "33 - Illizi",
  "34 - Bordj Bou Arreridj",
  "35 - Boumerdes",
  "36 - El Tarf",
  "37 - Tindouf",
  "38 - Tissemsilt",
  "39 - El Oued",
  "40 - Khenchela",
  "41 - Souk Ahras",
  "42 - Tipaza",
  "43 - Mila",
  "44 - Ain Defla",
  "45 - Naama",
  "46 - Ain Temouchent",
  "47 - Ghardaia",
  "48 - Relizane",
  "49 - El M'Ghair",
  "50 - El Menia",
  "51 - Ouled Djellal",
  "52 - Bordj Badji Mokhtar",
  "53 - Beni Abbes",
  "54 - Timimoun",
  "55 - Touggourt",
  "56 - Djanet",
  "57 - In Salah",
  "58 - In Guezzam",
  "59 - Aflou",
  "60 - El Abiodh Sidi Cheikh",
  "61 - Barika",
  "62 - Ksar Chellala",
  "63 - Messaad",
  "64 - Ain Oussara",
  "65 - Bou Saada",
  "66 - El Kantara",
  "67 - Bir El Ater",
  "68 - Ksar El Boukhari",
  "69 - El Aricha"
] as const;

export type Wilaya = (typeof WILAYAS)[number];

export function getWilayaName(code: string | number): string | undefined {
  const codeStr = String(code).padStart(2, "0");
  return WILAYAS.find((w) => w.startsWith(codeStr));
}

export function getWilayaCode(name: string): string {
  return name.split(" - ")[0];
}

export function getWilayaNamePart(fullName: string): string {
  const parts = fullName.split(" - ");
  return parts.length > 1 ? parts[1] : fullName;
}

function fixMojibake(str: string): string {
  try {

    if (!/[\xC0-\xFF]/.test(str)) return str;

    return decodeURIComponent(escape(str));
  } catch {
    return str;
  }
}

export function lookupWilayaByName(name: string | undefined | null): string | undefined {
  if (!name) return undefined;

  const fixed = fixMojibake(String(name).trim());
  const normalized = fixed.normalize("NFC").toLowerCase();

  const match = WILAYAS.find((w) => {
    const namePart = getWilayaNamePart(w).toLowerCase();

    return namePart === normalized ||
           w.toLowerCase().includes(normalized) ||
           normalized.includes(namePart);
  });

  return match;
}

export function getWilayaDisplayName(value: string | undefined | null): string {
  if (!value) return "—";

  const trimmed = value.trim();

  const fixed = fixMojibake(trimmed);

  const codeMatch = fixed.match(/^(\d{1,2})$/);
  if (codeMatch) {
    const code = codeMatch[1].padStart(2, "0");
    const fullName = getWilayaName(code);
    return fullName ? getWilayaNamePart(fullName) : fixed;
  }

  const fullFormatMatch = fixed.match(/^\d{1,2}\s*-\s*(.+)$/);
  if (fullFormatMatch) {
    return fullFormatMatch[1];
  }

  const lookupResult = lookupWilayaByName(fixed);
  if (lookupResult) {
    return getWilayaNamePart(lookupResult);
  }

  return fixed;
}
