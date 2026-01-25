import { Scholarship } from '../types';

// --- THE MASTER DATABASE (17 Schemes) ---
// This is your "Local Database"
const SCHOLARSHIPS_DB: Scholarship[] = [
  // 1. GENERAL & JAGANANNA
  {
    id: '1',
    name: "Jagananna Vidya Deevena (RTF)",
    provider: "Andhra Pradesh Govt",
    category: "All (SC/ST/BC/Kapu/Minority)",
    amount: "Full Fee Reimbursement",
    deadline: "Open",
    description: "Full tuition fee reimbursement for ITI, Polytechnic, Degree, B.Tech, MBA, MCA. Money credited to mother's account.",
    eligibility: ["Income < ₹2.5L", "75% Attendance", "AP Resident"],
    applicationLink: "https://jnanabhumi.ap.gov.in/",
    tags: ["fee", "reimbursement", "btech", "degree", "engineering", "mba", "mca", "polytechnic", "rtf", "tuition", "general"]
  },
  {
    id: '2',
    name: "Jagananna Vasathi Deevena (MTF)",
    provider: "Andhra Pradesh Govt",
    category: "All (SC/ST/BC/Kapu/Minority)",
    amount: "₹10,000 - ₹20,000 per year",
    deadline: "Open",
    description: "Financial aid for hostel and food expenses. ITI: ₹10K, Polytechnic: ₹15K, Degree/Engg: ₹20K.",
    eligibility: ["Income < ₹2.5L", "Hostel Student"],
    applicationLink: "https://jnanabhumi.ap.gov.in/",
    tags: ["hostel", "food", "mess", "boarding", "lodging", "mtf", "stay", "accommodation"]
  },
  {
    id: '3',
    name: "Ambedkar Overseas Vidya Nidhi",
    provider: "Andhra Pradesh Govt",
    category: "SC/ST",
    amount: "Up to ₹15 Lakhs",
    deadline: "September / February",
    description: "Financial assistance for SC/ST students pursuing Masters or PhD abroad (USA, UK, Australia, etc.).",
    eligibility: ["Income < ₹6L", "Valid Passport/Visa", "60% in Degree"],
    applicationLink: "https://jnanabhumi.ap.gov.in/",
    tags: ["abroad", "foreign", "masters", "phd", "ms", "overseas", "usa", "uk", "sc", "st"]
  },
  {
    id: '4',
    name: "NSP Post Matric Scholarship",
    provider: "Central Govt",
    category: "Minority",
    amount: "Variable",
    deadline: "October",
    description: "Central scholarship for Minority community students (Muslim, Christian, Sikh, etc.) from Class 11 to Ph.D.",
    eligibility: ["Income < ₹2L", "50% Marks"],
    applicationLink: "https://scholarships.gov.in/",
    tags: ["muslim", "christian", "sikh", "minority", "central", "national", "jain", "parsi"]
  },
  // 2. BRAHMIN WELFARE
  {
    id: '101',
    name: "Bharati Scheme - Graduation",
    provider: "AP Brahmin Corp",
    category: "Brahmin",
    amount: "₹15,000 one-time",
    deadline: "Open",
    description: "Financial support for poor Brahmin students pursuing regular 3-year degree courses (BA, BSc, BCom).",
    eligibility: ["Income < ₹3L", "EWS Certificate", "Passed Inter"],
    applicationLink: "https://apadapter.ap.gov.in/",
    tags: ["degree", "b.a", "b.com", "b.sc", "graduation", "brahmin", "oc"]
  },
  {
    id: '103',
    name: "Bharati Scheme - Professional",
    provider: "AP Brahmin Corp",
    category: "Brahmin",
    amount: "₹20,000 one-time",
    deadline: "Open",
    description: "Financial aid for Brahmin students in professional courses like B.Tech, Medicine, Pharmacy, Law.",
    eligibility: ["Income < ₹3L", "Professional Course"],
    applicationLink: "https://apadapter.ap.gov.in/",
    tags: ["professional", "medicine", "engineering", "btech", "pharmacy", "law", "brahmin"]
  },
  {
    id: '106',
    name: "Veda Vyasa Scheme",
    provider: "AP Brahmin Corp",
    category: "Brahmin",
    amount: "₹5,000 - ₹10,000 per year",
    deadline: "Open",
    description: "Encouragement for students pursuing full-time Vedic Education.",
    eligibility: ["Vedic Student", "Income < ₹3L"],
    applicationLink: "https://apadapter.ap.gov.in/",
    tags: ["veda", "vedic", "archaka", "purohit", "priest", "brahmin"]
  },
  {
    id: '108',
    name: "Bharati Scheme (CA/ICWA)",
    provider: "AP Brahmin Corp",
    category: "Brahmin",
    amount: "₹15,000 (Inter) / ₹30,000 (Final)",
    deadline: "Open",
    description: "Financial assistance for Brahmin students pursuing CA (Chartered Accountancy) or ICWA.",
    eligibility: ["Income < ₹3L", "Cleared CPT"],
    applicationLink: "https://apadapter.ap.gov.in/",
    tags: ["ca", "chartered accountant", "ipcc", "cma", "brahmin", "commerce"]
  },
  // 3. WORKERS & DISABLED
  {
    id: '201',
    name: "BOC Workers Children Scholarship",
    provider: "Labour Dept",
    category: "Construction Workers",
    amount: "₹2,000 - ₹20,000",
    deadline: "Open",
    description: "Scholarship for children of registered Building & Other Construction (BOC) workers.",
    eligibility: ["Parent Registered with BOC Board", "Valid Labour Card"],
    applicationLink: "https://labour.ap.gov.in/",
    tags: ["labour", "worker", "construction", "mason", "daily wage", "coolie", "boc"]
  },
  {
    id: '301',
    name: "Sanction of Laptops",
    provider: "Dept for Differently Abled",
    category: "Differently Abled",
    amount: "Free Laptop (Worth ₹35,000)",
    deadline: "Open",
    description: "Free laptops for visually, hearing, or orthopedically challenged students in professional courses.",
    eligibility: ["Professional Course Student", "SADAREM Certificate"],
    applicationLink: "https://apte.ap.gov.in/",
    tags: ["laptop", "computer", "visually", "hearing", "disabled", "handicapped", "device", "blind", "deaf"]
  },
  {
    id: '302',
    name: "Motorized Three Wheelers",
    provider: "Dept for Differently Abled",
    category: "Differently Abled",
    amount: "Free Motorized Vehicle",
    deadline: "Open",
    description: "Provision of motorized three-wheelers (scooters) to eligible orthopedically challenged persons for mobility.",
    eligibility: ["Orthopedic Disability > 40%", "Age 18-45", "Income < ₹3L"],
    applicationLink: "https://apte.ap.gov.in/",
    tags: ["vehicle", "bike", "scooter", "mobility", "orthopedic", "disabled", "handicapped"]
  },
  {
    id: '303',
    name: "Daisy Players",
    provider: "Dept for Differently Abled",
    category: "Differently Abled",
    amount: "Free Audio Player",
    deadline: "Open",
    description: "Distribution of Daisy Players (Audio Books) to visually challenged students.",
    eligibility: ["Visually Challenged", "Income < ₹3L"],
    applicationLink: "https://apte.ap.gov.in/",
    tags: ["blind", "audio", "player", "daisy", "disabled", "visually challenged"]
  }
];

// --- SEARCH ENGINE LOGIC ---
const STOP_WORDS = new Set([
  'i', 'am', 'a', 'an', 'the', 'want', 'need', 'search', 'find', 'me', 'for', 
  'scholarship', 'scholarships', 'scheme', 'schemes', 'program', 'government', 
  'govt', 'please', 'help', 'apply', 'application', 'status', 'is', 'are'
]);

export const scholarshipService = {
  searchScholarships: async (query: string): Promise<Scholarship[]> => {
    // 1. Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Pre-processing
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/[\s,?.!]+/).filter(w => w.length > 2 && !STOP_WORDS.has(w));

    if (words.length === 0) return []; // Too vague

    // 3. Scoring System
    const scoredResults = SCHOLARSHIPS_DB.map(scholarship => {
      let score = 0;
      
      // Exact Category Match (High Value)
      if (words.some(w => scholarship.category.toLowerCase().includes(w))) score += 50;
      
      // Name Match (Medium Value)
      if (words.some(w => scholarship.name.toLowerCase().includes(w))) score += 30;
      
      // Tag Match (Good Value)
      const matchedTags = scholarship.tags.filter(tag => words.some(w => tag.includes(w)));
      score += matchedTags.length * 15;

      return { scholarship, score };
    });

    // 4. Threshold & Sort
    return scoredResults
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.scholarship);
  },

  getAllScholarships: async () => SCHOLARSHIPS_DB
};
