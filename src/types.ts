export type Language = 'en' | 'hi';

export type ServiceCategory =
  | 'education'
  | 'scholarships'
  | 'certificates'
  | 'recruitment'
  | 'agriculture'
  | 'electricity'
  | 'healthcare'
  | 'transport'
  | 'citizen'
  | 'schemes'
  | 'grievance';

export interface Service {
  id: string;
  name: string;
  nameHi: string;
  category: ServiceCategory;
  description: string;
  descriptionHi: string;
  whoIsItFor: string;
  whoIsItForHi: string;
  requiredDocs: string[];
  requiredDocsHi: string[];
  eligibility: string;
  eligibilityHi: string;
  estimatedSteps: number;
  officialFee: string;
  department: string;
  popular?: boolean;
  iconName: string;
}

export interface ApplicationDraft {
  serviceId: string;
  serviceName: string;
  progressPercent: number;
  lastSavedText: string;
  lastSavedTimestamp: number;
  currentStep: number;
  formData: {
    fullName: string;
    fatherName: string;
    gender: string;
    dob: string;
    mobile: string;
    samagraId: string;
    aadhaarNumber: string;
    district: string;
    tehsil: string;
    address: string;
    category: string;
    annualIncome: string;
    collegeName: string;
    courseName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    isMpResident: boolean;
  };
  uploadedDocs: {
    [key: string]: {
      fileName: string;
      status: 'analyzing' | 'verified' | 'mismatch' | 'unreadable';
      detectedName?: string;
      issueNote?: string;
    };
  };
}

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'DOCS_PENDING'
  | 'PAYMENT_PENDING'
  | 'APPROVED'
  | 'REJECTED';

export interface TimelineStep {
  title: string;
  titleHi: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  desc?: string;
}

export interface ApplicationItem {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceNameHi: string;
  applicantName: string;
  submittedDate: string;
  lastUpdated: string;
  status: ApplicationStatus;
  statusText: string;
  statusTextHi: string;
  timeline: TimelineStep[];
  whyReason: string;
  whyReasonHi: string;
  whatToDoNext: string;
  whatToDoNextHi: string;
  feeAmount: number;
  paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
  transactionId?: string;
}

export interface AlertItem {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  type: 'deadline' | 'document' | 'status' | 'general';
  date: string;
  read: boolean;
  actionText?: string;
  actionServiceId?: string;
}

export interface GrievanceTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: 'Registered' | 'Under Investigation' | 'Resolved';
  createdAt: string;
  resolutionNote?: string;
}

export interface ScholarshipItem {
  id: string;
  title: string;
  titleHi: string;
  provider: string;
  providerHi: string;
  amount: string;
  deadline: string;
  eligibilitySummary: string;
  eligibilitySummaryHi: string;
  requiredDocs: string[];
  explanation: string;
  explanationHi: string;
  serviceId?: string;
}

export interface GovernmentSchemeItem {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  categoryHi: string;
  department: string;
  benefitSummary: string;
  benefitSummaryHi: string;
  eligibility: string;
  eligibilityHi: string;
  requiredDocs: string[];
  explanation: string;
  explanationHi: string;
  serviceId?: string;
}

export interface VideoGuideItem {
  id: string;
  title: string;
  titleHi: string;
  duration: string;
  thumbnailColor: string;
  description: string;
  descriptionHi: string;
  steps: string[];
  stepsHi: string[];
}
