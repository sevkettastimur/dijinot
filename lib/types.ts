export type EducationTier = 'ilkokul' | 'ortaokul' | 'lise' | 'lisans' | 'akademik';

export type AcademicLevel = 
  | '1. Sınıf' 
  | '2. Sınıf' 
  | '3. Sınıf' 
  | '4. Sınıf' 
  | '5. Sınıf' 
  | '6. Sınıf' 
  | '7. Sınıf' 
  | '8. Sınıf (LGS)' 
  | '9. Sınıf' 
  | '10. Sınıf' 
  | '11. Sınıf' 
  | '12. Sınıf (TYT/AYT)' 
  | 'Lisans 1. Sınıf' 
  | 'Lisans 2. Sınıf' 
  | 'Lisans 3. Sınıf' 
  | 'Lisans 4. Sınıf' 
  | 'Yüksek Lisans' 
  | 'Doktora' 
  | 'Doçentlik & Prof';

export type ExamType = 
  | 'Okul Sınavı' 
  | 'LGS Denemesi' 
  | 'TYT / AYT' 
  | 'Vize' 
  | 'Final' 
  | 'Büt' 
  | 'Laboratuvar' 
  | 'Tez Özeti' 
  | 'Doçentlik Sunumu' 
  | 'Ders Notu';

export interface TierInfo {
  id: EducationTier;
  name: string;
  shortName: string;
  iconName: string;
  badgeColor: string;
  description: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  city: string;
  facultyCount: number;
  noteCount: number;
  studentCount: number;
}

export interface Faculty {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  description: string;
  departmentCount: number;
  totalNotes: number;
  colorGradient: string;
}

export interface Department {
  id: string;
  slug: string;
  facultySlug: string;
  name: string;
  code: string;
  description: string;
  activeCoursesCount: number;
  totalNotesCount: number;
}

export interface Professor {
  id: string;
  name: string;
  title: 'Prof. Dr.' | 'Doç. Dr.' | 'Dr. Öğr. Üyesi' | 'Uzman Öğretmen' | 'Arş. Gör.';
  university: string;
  department: string;
  rating: number;
  verifiedCount: number;
  avatar: string;
}

export interface OcrSummary {
  summaryTitle: string;
  overview: string;
  keyPoints: string[];
  formulaeOrKeywords: string[];
  probableExamQuestions: { question: string; topic: string; difficulty: 'Kolay' | 'Orta' | 'Zor' }[];
  aiConfidenceScore: number;
}

export interface NoteComment {
  id: string;
  userName: string;
  userAvatar: string;
  userBadge?: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
}

export interface LectureNote {
  id: string;
  title: string;
  description: string;
  educationTier: EducationTier;
  university?: string;
  faculty?: string;
  facultySlug?: string;
  department?: string;
  deptSlug?: string;
  courseCode: string;
  courseName: string;
  level: AcademicLevel;
  examType: ExamType;
  professorName: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: 'Derece Öğrencisi' | 'Öğretmen / Eğitmen' | 'Akademisyen' | 'Derece Mezunu';
  academicYear: string;
  fileFormat: 'PDF';
  pageCount: number;
  fileSizeBytes: number;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  viewCount: number;
  dijipuanPrice: number;
  isVerifiedByProfessor: boolean;
  isAiOcrProcessed: boolean;
  tags: string[];
  previewPages: string[];
  ocrSummary: OcrSummary;
  comments: NoteComment[];
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  educationTier: EducationTier;
  departmentSlug?: string;
  level: AcademicLevel;
  credits?: number;
  professors: string[];
  totalNotes: number;
  examCount: number;
  description: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  university: string;
  department: string;
  avatar: string;
  totalUploads: number;
  totalDownloads: number;
  earnedDijipuan: number;
  reputationScore: number;
  badgeTitle: string;
  /** Education tier the member primarily contributes to */
  educationTier: EducationTier;
  /** Membership tier, used for the badge shown next to the name */
  role: SubscriptionRole;
  isVerifiedEducator: boolean;
  /** Rank movement since last week (positive = climbed) */
  rankDelta: number;
  averageRating: number;
}

export type SubscriptionRole = 'FREE_STUDENT' | 'PRO_STUDENT' | 'RESEARCHER_DOCENT';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  department: string;
  academicLevel: AcademicLevel;
  avatar: string;
  dijipuanBalance: number;
  reputationScore: number;
  uploadedCount: number;
  downloadedCount: number;
  savedCount: number;
  tier: 'Ücretsiz' | 'Pro Akademik' | 'Araştırmacı / Doçent';
  role: SubscriptionRole;
  monthlyDownloadsUsed: number;
  monthlyDownloadLimit: number;
  isVerifiedEducator: boolean;
  offlineSyncEnabled: boolean;
  totalEarningsMonthly: number;
  totalEarningsAllTime: number;
}

export interface NoteEarning {
  id: string;
  noteTitle: string;
  courseCode: string;
  salesCount: number;
  earningsTotal: number;
  earningsThisMonth: number;
  date: string;
  status: 'active' | 'pending' | 'paused';
}

export interface PlagiarismResult {
  fileName: string;
  overallScore: number;
  aiGenerated: number;
  copyrightRisk: 'low' | 'medium' | 'high';
  matches: { source: string; similarity: number }[];
}

export interface PresentationTemplate {
  id: string;
  title: string;
  category: 'doktora' | 'docentlik' | 'konferans' | 'tez';
  slides: number;
  downloads: number;
  preview: string;
  isPremium: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
}

/* ==========================================================================
   ADMIN DASHBOARD DOMAIN TYPES
   ========================================================================== */

export type AcademicTitle = 'Prof. Dr.' | 'Doç. Dr.' | 'Dr. Öğr. Üyesi' | 'Uzman Öğretmen' | 'Arş. Gör.';

/** Content / Note moderation queue */
export type ModerationStatus = 'pending_ai' | 'flagged' | 'approved' | 'rejected';

export interface ModerationItem {
  id: string;
  noteTitle: string;
  authorName: string;
  authorAvatar: string;
  courseCode: string;
  courseName: string;
  educationTier: EducationTier;
  level: AcademicLevel;
  examType: ExamType;
  submittedAt: string;
  pageCount: number;
  fileSizeBytes: number;
  /** % text-overlap similarity against the corpus (higher = riskier) */
  plagiarismScore: number;
  /** % probability the document was AI-generated */
  aiGeneratedScore: number;
  status: ModerationStatus;
  flagReason?: string;
  previewImage: string;
  dijipuanPrice: number;
  isVerifiedAuthor: boolean;
}

/** User & subscription management */
export type AdminUserStatus = 'active' | 'suspended' | 'pending';

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  avatar: string;
  university: string;
  department: string;
  role: SubscriptionRole;
  status: AdminUserStatus;
  dijipuanBalance: number;
  uploads: number;
  downloads: number;
  joinedAt: string;
  lastActive: string;
  isVerifiedEducator: boolean;
  reputationScore: number;
}

/** Academic / educator verification requests */
export type VerificationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface VerificationDoc {
  label: string;
  kind: 'Akademik Kimlik' | 'ORCID' | 'Üniversite Belgesi' | 'Yayın Listesi' | 'Diploma';
  verified: boolean;
}

export interface VerificationRequest {
  id: string;
  applicantName: string;
  applicantAvatar: string;
  requestedTitle: AcademicTitle;
  university: string;
  department: string;
  email: string;
  orcidId: string;
  publicationCount: number;
  hIndex: number;
  submittedAt: string;
  status: VerificationStatus;
  documents: VerificationDoc[];
  note?: string;
}

/** Telif / DMCA copyright claims */
export type ClaimStatus = 'open' | 'investigating' | 'taken_down' | 'dismissed';
export type ClaimType = 'Telif İhlali' | 'İntihal' | 'Kişisel Veri' | 'İzinsiz Ticari Kullanım';

export interface CopyrightClaim {
  id: string;
  noteId: string;
  noteTitle: string;
  uploaderName: string;
  uploaderAvatar: string;
  claimantName: string;
  claimantOrg: string;
  claimType: ClaimType;
  reason: string;
  reportedAt: string;
  status: ClaimStatus;
  severity: 'low' | 'medium' | 'high';
  educationTier: EducationTier;
}

/** Monetization & payout approvals */
export type PayoutStatus = 'pending' | 'approved' | 'processing' | 'rejected' | 'paid';
export type PayoutMethod = 'IBAN' | 'Stripe' | 'iyzico';

export interface PayoutRequest {
  id: string;
  userName: string;
  userAvatar: string;
  role: SubscriptionRole;
  isVerifiedEducator: boolean;
  amountTRY: number;
  dijipuanRedeemed: number;
  method: PayoutMethod;
  /** masked account reference (IBAN tail / stripe acct) */
  accountRef: string;
  salesCount: number;
  requestedAt: string;
  status: PayoutStatus;
}

/** Analytics primitives */
export interface TierUploadStat {
  tier: EducationTier;
  label: string;
  count: number;
  /** tailwind bg-* class for the bar fill */
  barClass: string;
}

export interface DailyActiveStat {
  day: string;
  users: number;
}

export interface RevenueStat {
  month: string;
  revenueTRY: number;
  payoutsTRY: number;
}

/** Admin notification center */
export type AdminNotificationType = 'moderation' | 'verification' | 'dmca' | 'payout' | 'system';

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
}

/** Top-line KPIs for the admin overview */
export interface AdminOverviewStats {
  usersByRole: Record<SubscriptionRole, number>;
  totalUsers: number;
  totalNotes: number;
  pendingModeration: number;
  pendingVerifications: number;
  openClaims: number;
  pendingPayouts: number;
  monthlyRevenueTRY: number;
  monthlyPayoutsTRY: number;
  dijipuanCirculating: number;
}
