// Comprehensive IB Diploma Programme reference data

export interface IBSubject {
  name: string;
  group: number;
  groupName: string;
  slug: string;
  hasHL: boolean;
  hasSL: boolean;
  canBeEE: boolean;
  color: string;
}

export const IB_GROUPS = [
  { number: 1, name: "Studies in Language and Literature" },
  { number: 2, name: "Language Acquisition" },
  { number: 3, name: "Individuals and Societies" },
  { number: 4, name: "Sciences" },
  { number: 5, name: "Mathematics" },
  { number: 6, name: "The Arts" },
];

export const IB_SUBJECTS: IBSubject[] = [
  // Group 1
  { name: "Language A: Literature", group: 1, groupName: "Studies in Language and Literature", slug: "lang-a-literature", hasHL: true, hasSL: true, canBeEE: true, color: "#00ff41" },
  { name: "Language A: Language and Literature", group: 1, groupName: "Studies in Language and Literature", slug: "lang-a-lang-lit", hasHL: true, hasSL: true, canBeEE: true, color: "#39ff14" },
  { name: "Literature and Performance", group: 1, groupName: "Studies in Language and Literature", slug: "literature-performance", hasHL: false, hasSL: true, canBeEE: false, color: "#7fff00" },
  // Group 2
  { name: "Language B", group: 2, groupName: "Language Acquisition", slug: "lang-b", hasHL: true, hasSL: true, canBeEE: false, color: "#ffb000" },
  { name: "Language ab initio", group: 2, groupName: "Language Acquisition", slug: "lang-ab-initio", hasHL: false, hasSL: true, canBeEE: false, color: "#ffa500" },
  { name: "Classical Languages", group: 2, groupName: "Language Acquisition", slug: "classical-lang", hasHL: true, hasSL: true, canBeEE: true, color: "#ff8c00" },
  // Group 3
  { name: "Business Management", group: 3, groupName: "Individuals and Societies", slug: "business-mgmt", hasHL: true, hasSL: true, canBeEE: true, color: "#00bfff" },
  { name: "Economics", group: 3, groupName: "Individuals and Societies", slug: "economics", hasHL: true, hasSL: true, canBeEE: true, color: "#1e90ff" },
  { name: "Geography", group: 3, groupName: "Individuals and Societies", slug: "geography", hasHL: true, hasSL: true, canBeEE: true, color: "#00ced1" },
  { name: "Global Politics", group: 3, groupName: "Individuals and Societies", slug: "global-politics", hasHL: true, hasSL: true, canBeEE: true, color: "#48d1cc" },
  { name: "History", group: 3, groupName: "Individuals and Societies", slug: "history", hasHL: true, hasSL: true, canBeEE: true, color: "#6495ed" },
  { name: "IT in a Global Society", group: 3, groupName: "Individuals and Societies", slug: "itgs", hasHL: true, hasSL: true, canBeEE: true, color: "#87ceeb" },
  { name: "Philosophy", group: 3, groupName: "Individuals and Societies", slug: "philosophy", hasHL: true, hasSL: true, canBeEE: true, color: "#9370db" },
  { name: "Psychology", group: 3, groupName: "Individuals and Societies", slug: "psychology", hasHL: true, hasSL: true, canBeEE: true, color: "#8a2be2" },
  { name: "Social and Cultural Anthropology", group: 3, groupName: "Individuals and Societies", slug: "social-anthropology", hasHL: true, hasSL: true, canBeEE: true, color: "#ba55d3" },
  { name: "World Religions", group: 3, groupName: "Individuals and Societies", slug: "world-religions", hasHL: false, hasSL: true, canBeEE: false, color: "#9932cc" },
  // Group 4
  { name: "Biology", group: 4, groupName: "Sciences", slug: "biology", hasHL: true, hasSL: true, canBeEE: true, color: "#00ff00" },
  { name: "Chemistry", group: 4, groupName: "Sciences", slug: "chemistry", hasHL: true, hasSL: true, canBeEE: true, color: "#32cd32" },
  { name: "Computer Science", group: 4, groupName: "Sciences", slug: "computer-science", hasHL: true, hasSL: true, canBeEE: true, color: "#00fa9a" },
  { name: "Design Technology", group: 4, groupName: "Sciences", slug: "design-tech", hasHL: true, hasSL: true, canBeEE: true, color: "#7cfc00" },
  { name: "Environmental Systems and Societies", group: 4, groupName: "Sciences", slug: "ess", hasHL: false, hasSL: true, canBeEE: true, color: "#66ff00" },
  { name: "Physics", group: 4, groupName: "Sciences", slug: "physics", hasHL: true, hasSL: true, canBeEE: true, color: "#adff2f" },
  { name: "Sports, Exercise and Health Science", group: 4, groupName: "Sciences", slug: "sports-science", hasHL: true, hasSL: true, canBeEE: true, color: "#9acd32" },
  // Group 5
  { name: "Mathematics: Analysis and Approaches", group: 5, groupName: "Mathematics", slug: "math-aa", hasHL: true, hasSL: true, canBeEE: true, color: "#ff69b4" },
  { name: "Mathematics: Applications and Interpretation", group: 5, groupName: "Mathematics", slug: "math-ai", hasHL: true, hasSL: true, canBeEE: true, color: "#ff1493" },
  // Group 6
  { name: "Dance", group: 6, groupName: "The Arts", slug: "dance", hasHL: true, hasSL: true, canBeEE: true, color: "#ffd700" },
  { name: "Film", group: 6, groupName: "The Arts", slug: "film", hasHL: true, hasSL: true, canBeEE: true, color: "#ffeb3b" },
  { name: "Music", group: 6, groupName: "The Arts", slug: "music", hasHL: true, hasSL: true, canBeEE: true, color: "#ffc107" },
  { name: "Theatre", group: 6, groupName: "The Arts", slug: "theatre", hasHL: true, hasSL: true, canBeEE: true, color: "#ff9800" },
  { name: "Visual Arts", group: 6, groupName: "The Arts", slug: "visual-arts", hasHL: true, hasSL: true, canBeEE: true, color: "#ff5722" },
];

export function getSubjectBySlug(slug: string): IBSubject | undefined {
  return IB_SUBJECTS.find((s) => s.slug === slug);
}

export function getSubjectsByGroup(group: number): IBSubject[] {
  return IB_SUBJECTS.filter((s) => s.group === group);
}

// Sample syllabus topic data for common subjects
export interface SyllabusTopic {
  subjectSlug: string;
  level: "HL" | "SL";
  topicNumber: string;
  topicName: string;
  subtopics: { name: string; hours: number; description?: string }[];
  totalHours: number;
}

export const SAMPLE_SYLLABUS: Record<string, SyllabusTopic[]> = {
  biology: [
    {
      subjectSlug: "biology", level: "SL", topicNumber: "1", topicName: "Cell Biology",
      subtopics: [
        { name: "Introduction to cells", hours: 2.5, description: "Cell theory, cell function" },
        { name: "Ultrastructure of cells", hours: 3, description: "Prokaryotic vs eukaryotic" },
        { name: "Membrane structure", hours: 2, description: "Phospholipid bilayer" },
        { name: "Membrane transport", hours: 2.5, description: "Diffusion, osmosis, active transport" },
        { name: "The origin of cells", hours: 1.5, description: "Cell evolution" },
        { name: "Cell division", hours: 3, description: "Mitosis, cell cycle" },
      ], totalHours: 14.5,
    },
    {
      subjectSlug: "biology", level: "SL", topicNumber: "2", topicName: "Molecular Biology",
      subtopics: [
        { name: "Molecules to metabolism", hours: 2, description: "Organic compounds" },
        { name: "Water", hours: 1.5, description: "Properties of water" },
        { name: "Carbohydrates and lipids", hours: 3, description: "Structure and function" },
        { name: "Proteins", hours: 3, description: "Amino acids, enzyme structure" },
        { name: "Enzymes", hours: 2, description: "Catalysis, inhibition" },
        { name: "DNA and RNA", hours: 2.5, description: "Nucleic acid structure" },
        { name: "DNA replication", hours: 2, description: "Transcription, translation" },
        { name: "Cell respiration", hours: 2, description: "ATP, aerobic/anaerobic" },
        { name: "Photosynthesis", hours: 2, description: "Light-dependent/independent" },
      ], totalHours: 20,
    },
    {
      subjectSlug: "biology", level: "SL", topicNumber: "3", topicName: "Genetics",
      subtopics: [
        { name: "Genes", hours: 2, description: "Gene loci, alleles" },
        { name: "Chromosomes", hours: 2, description: "Karyotypes, sex determination" },
        { name: "Meiosis", hours: 2.5, description: "Crossing over, recombination" },
        { name: "Inheritance", hours: 3, description: "Mendelian genetics" },
        { name: "Genetic modification", hours: 2, description: "GMOs, CRISPR" },
      ], totalHours: 11.5,
    },
    {
      subjectSlug: "biology", level: "HL", topicNumber: "7", topicName: "Nucleic Acids (HL)",
      subtopics: [
        { name: "DNA structure and replication", hours: 3, description: "Detail of replication" },
        { name: "Transcription and gene expression", hours: 2.5, description: "RNA polymerase" },
        { name: "Translation", hours: 2.5, description: "Ribosomes, tRNA" },
      ], totalHours: 8,
    },
    {
      subjectSlug: "biology", level: "HL", topicNumber: "8", topicName: "Metabolism & Respiration (HL)",
      subtopics: [
        { name: "Metabolism", hours: 2, description: "Metabolic pathways" },
        { name: "Cell respiration", hours: 3, description: "Krebs cycle, ETC" },
        { name: "Photosynthesis", hours: 2.5, description: "Calvin cycle" },
      ], totalHours: 7.5,
    },
  ],
  chemistry: [
    {
      subjectSlug: "chemistry", level: "SL", topicNumber: "1", topicName: "Stoichiometric Relationships",
      subtopics: [
        { name: "Moles and molar mass", hours: 2, description: "Avogadro's constant" },
        { name: "Chemical equations", hours: 2, description: "Balancing equations" },
        { name: "Mass and gaseous volume relationships", hours: 3, description: "Ideal gas law" },
        { name: "Solutions", hours: 2, description: "Concentration, titration" },
      ], totalHours: 9,
    },
    {
      subjectSlug: "chemistry", level: "SL", topicNumber: "2", topicName: "Atomic Structure",
      subtopics: [
        { name: "The atom", hours: 1.5, description: "Atomic models" },
        { name: "Electron configuration", hours: 2.5, description: "Orbitals, energy levels" },
      ], totalHours: 4,
    },
    {
      subjectSlug: "chemistry", level: "SL", topicNumber: "3", topicName: "Periodicity",
      subtopics: [
        { name: "Periodic table", hours: 1.5, description: "Groups and periods" },
        { name: "Periodic trends", hours: 2, description: "Ionization energy, electronegativity" },
      ], totalHours: 3.5,
    },
    {
      subjectSlug: "chemistry", level: "SL", topicNumber: "4", topicName: "Chemical Bonding",
      subtopics: [
        { name: "Ionic bonding", hours: 2, description: "Crystal lattices" },
        { name: "Covalent bonding", hours: 3, description: "Lewis structures, VSEPR" },
        { name: "Intermolecular forces", hours: 2, description: "Van der Waals, hydrogen bonding" },
        { name: "Metallic bonding", hours: 1.5, description: "Delocalized electrons" },
      ], totalHours: 8.5,
    },
  ],
  physics: [
    {
      subjectSlug: "physics", level: "SL", topicNumber: "1", topicName: "Measurements and Uncertainties",
      subtopics: [
        { name: "Measurements in physics", hours: 1.5, description: "SI units, orders of magnitude" },
        { name: "Uncertainties and errors", hours: 2.5, description: "Absolute, fractional, percentage" },
        { name: "Vectors and scalars", hours: 2, description: "Vector addition, resolution" },
      ], totalHours: 6,
    },
    {
      subjectSlug: "physics", level: "SL", topicNumber: "2", topicName: "Mechanics",
      subtopics: [
        { name: "Kinematics", hours: 3, description: "SUVAT equations" },
        { name: "Forces", hours: 3, description: "Newton's laws" },
        { name: "Work, energy and power", hours: 3, description: "Conservation of energy" },
        { name: "Momentum and impulse", hours: 2.5, description: "Conservation of momentum" },
      ], totalHours: 11.5,
    },
    {
      subjectSlug: "physics", level: "SL", topicNumber: "3", topicName: "Thermal Physics",
      subtopics: [
        { name: "Thermal concepts", hours: 2, description: "Temperature, heat" },
        { name: "Modelling a gas", hours: 2.5, description: "Ideal gas law, kinetic model" },
      ], totalHours: 4.5,
    },
  ],
  "math-aa": [
    {
      subjectSlug: "math-aa", level: "SL", topicNumber: "1", topicName: "Number and Algebra",
      subtopics: [
        { name: "Sequences and series", hours: 4, description: "Arithmetic, geometric" },
        { name: "Exponents and logarithms", hours: 3.5, description: "Laws, change of base" },
        { name: "Binomial theorem", hours: 2.5, description: "Binomial expansion" },
        { name: "Complex numbers", hours: 3, description: "Real, imaginary, Argand" },
        { name: "Proof", hours: 2, description: "Direct, contradiction" },
      ], totalHours: 15,
    },
    {
      subjectSlug: "math-aa", level: "SL", topicNumber: "2", topicName: "Functions",
      subtopics: [
        { name: "Linear and quadratic functions", hours: 3, description: "Graphing, transformations" },
        { name: "Exponential and logarithmic functions", hours: 3, description: "Growth models" },
        { name: "Rational functions", hours: 2, description: "Asymptotes" },
      ], totalHours: 8,
    },
    {
      subjectSlug: "math-aa", level: "SL", topicNumber: "3", topicName: "Geometry and Trigonometry",
      subtopics: [
        { name: "Trigonometric ratios", hours: 3, description: "Unit circle" },
        { name: "Trigonometric functions", hours: 3, description: "Graphs, equations" },
        { name: "Trigonometric identities", hours: 2.5, description: "Pythagorean, double-angle" },
      ], totalHours: 8.5,
    },
  ],
  economics: [
    {
      subjectSlug: "economics", level: "SL", topicNumber: "1", topicName: "Introduction to Economics",
      subtopics: [
        { name: "What is economics?", hours: 1.5, description: "Scarcity, choice" },
        { name: "Economic models", hours: 1, description: "PPF, circular flow" },
      ], totalHours: 2.5,
    },
    {
      subjectSlug: "economics", level: "SL", topicNumber: "2", topicName: "Microeconomics",
      subtopics: [
        { name: "Demand", hours: 2.5, description: "Law of demand, elasticity" },
        { name: "Supply", hours: 2.5, description: "Law of supply" },
        { name: "Market equilibrium", hours: 2, description: "Price mechanism" },
        { name: "Market failure", hours: 3, description: "Externalities, public goods" },
        { name: "Government intervention", hours: 2.5, description: "Taxes, subsidies" },
      ], totalHours: 12.5,
    },
  ],
  history: [
    {
      subjectSlug: "history", level: "SL", topicNumber: "1", topicName: "Understanding History",
      subtopics: [
        { name: "Historical perspectives", hours: 2, description: "Historiography" },
        { name: "Sources and evidence", hours: 2, description: "Primary vs secondary" },
      ], totalHours: 4,
    },
    {
      subjectSlug: "history", level: "SL", topicNumber: "2", topicName: "20th Century World History",
      subtopics: [
        { name: "Causes of WWI", hours: 3, description: "Alliances, nationalism" },
        { name: "Russian Revolution", hours: 3.5, description: "Bolshevik takeover" },
        { name: "Rise of totalitarianism", hours: 3.5, description: "Stalin, Hitler" },
        { name: "Causes of WWII", hours: 3, description: "Appeasement, expansion" },
        { name: "Cold War", hours: 4, description: "Superpower rivalry" },
      ], totalHours: 17,
    },
  ],
  psychology: [
    {
      subjectSlug: "psychology", level: "SL", topicNumber: "1", topicName: "Biological Approach",
      subtopics: [
        { name: "Brain and behavior", hours: 3, description: "Neurotransmission" },
        { name: "Hormones and behavior", hours: 2, description: "Endocrine system" },
        { name: "Genetics and behavior", hours: 2, description: "Twin studies" },
      ], totalHours: 7,
    },
    {
      subjectSlug: "psychology", level: "SL", topicNumber: "2", topicName: "Cognitive Approach",
      subtopics: [
        { name: "Memory models", hours: 2.5, description: "Multi-store, working memory" },
        { name: "Thinking and decision-making", hours: 2.5, description: "Heuristics, biases" },
        { name: "Cognitive processing", hours: 2, description: "Schema theory" },
      ], totalHours: 7,
    },
    {
      subjectSlug: "psychology", level: "SL", topicNumber: "3", topicName: "Sociocultural Approach",
      subtopics: [
        { name: "Social cognition", hours: 2, description: "Attribution theory" },
        { name: "Social identity", hours: 2.5, description: "In-group, out-group" },
        { name: "Cultural influences", hours: 2, description: "Individualism vs collectivism" },
      ], totalHours: 6.5,
    },
  ],
  "computer-science": [
    {
      subjectSlug: "computer-science", level: "SL", topicNumber: "1", topicName: "System Fundamentals",
      subtopics: [
        { name: "Computer organization", hours: 2, description: "CPU, memory, storage" },
        { name: "System design", hours: 2.5, description: "SDLC, requirements" },
      ], totalHours: 4.5,
    },
    {
      subjectSlug: "computer-science", level: "SL", topicNumber: "2", topicName: "Computer Organization",
      subtopics: [
        { name: "Data representation", hours: 3, description: "Binary, hexadecimal" },
        { name: "Logic gates", hours: 2.5, description: "Boolean logic" },
      ], totalHours: 5.5,
    },
    {
      subjectSlug: "computer-science", level: "SL", topicNumber: "3", topicName: "Networks",
      subtopics: [
        { name: "Network fundamentals", hours: 2, description: "Protocols, topologies" },
        { name: "Data transmission", hours: 2, description: "Packet switching" },
        { name: "Security", hours: 2, description: "Encryption, threats" },
      ], totalHours: 6,
    },
    {
      subjectSlug: "computer-science", level: "SL", topicNumber: "4", topicName: "Computational Thinking",
      subtopics: [
        { name: "Problem-solving", hours: 2, description: "Decomposition, abstraction" },
        { name: "Algorithms", hours: 3, description: "Sorting, searching" },
        { name: "Programming basics", hours: 4, description: "Variables, control structures" },
      ], totalHours: 9,
    },
  ],
};
