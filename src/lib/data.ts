
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales Rep';
  avatar: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Conference' | 'Webinar' | 'Trade Show' | 'Digital' | 'Other';
  startDate: string;
  endDate: string;
  budget: number;
  description: string;
  targetAudience: string;
  keyMessages: string;
  goals: string;
}

export type LeadStatus = 'Unaware' | 'Engaged' | 'Prospect' | 'Qualified' | 'Future Opportunity' | 'Disqualified';
export type LeadStage = 'Lead' | 'Opportunity' | 'Proposal' | 'Client-Delivery' | 'Implementation' | 'Post-Sales';


export interface StatusUpdate {
  status: LeadStatus;
  date: string;
  notes: string;
  updatedBy: string; // userId
  data?: any;
}


export interface ProspectData {
  responseDate: string;
  engagementType: 'Phone response' | 'Email reply' | 'Meeting request' | 'Other';
  contactQuality: 'Decision maker' | 'Influencer' | 'Gatekeeper';
  qualificationNotes: string;
  demoScheduled: 'Yes' | 'No';
  demoDate?: string;
  competitorAwareness: string;
  painPoints: string;
  nextSteps: string;
}

export interface FutureOpportunityData {
    reminderDate: string;
    reason: string;
}

export interface DisqualifiedData {
    reason: 'Not a fit' | 'No budget' | 'No timeline' | 'Went with competitor' | 'Unresponsive' | 'Other';
    competitor?: string;
}

export interface ProposalRevision {
  version: number;
  date: string;
  notes: string;
  previousState: Omit<ProposalData, 'revisionHistory'>;
}


export interface ProposalData {
  templateUsed: string;
  servicesIncluded: string;
  pricingStructure: 'Fixed' | 'T&M' | 'Hybrid';
  projectDuration: string; // e.g., '3 months'
  resourceRequirements: string;
  termsVersion: string;
  revisionHistory: ProposalRevision[];
}

export interface InternalReviewData {
  cstReviewStatus: 'Pending' | 'Approved' | 'Needs Changes';
  cstReviewer?: string;
  cstReviewDate?: string;
  technicalFeasibilityNotes?: string;
  resourceAvailabilityCheck: 'Completed' | 'Pending';
  croReviewStatus: 'Pending' | 'Approved' | 'Needs Changes';
  croReviewer?: string;
  financialReviewDate?: string;
  marginAnalysis?: string;
  riskAssessment?: string;
  finalApprovalDate?: string;
  approvedBy?: string;
}

export interface ClientDeliveryData {
  proposalSentDate: string;
  proposalPresentationDate: string;
  presentationMethod: 'In-person' | 'Virtual' | 'Email only';
  attendees: string;
  decisionMakerPresent: 'Yes' | 'No';
  clientFeedback: string;
  clientQuestions: string;
  additionalRequirements: string;
  competitiveSituationUpdate: string;
  proposalRevisionRequested: 'Yes' | 'No';
  followUpActions: string;
  decisionTimeline: string;
}

export interface ContractData {
  templateUsed: string;
  version: string;
  legalReviewRequired: 'Yes' | 'No';
  legalReviewer?: string;
  sentDate?: string;
  clientReviewStatus: 'Pending' | 'Reviewed' | 'Approved';
  redlinesRequested: string;
  negotiationLog: string;
  finalDate?: string;
  signedDate?: string;
  finalValue: number;
  paymentTerms: string;
  keyClauses: string;
  renewalTerms: string;
  projectSuccessCriteria: string;
}

export interface ImplementationAndTrainingData {
  projectManager: string;
  implementationTeam: string[];
  clientPoc: string;
  kickoffDate: string;
  goLiveDate: string;
  implementationPlanStatus: 'Created' | 'Pending';
  resourceAllocation: string;
  trainingPlanStatus: 'Created' | 'Pending';
  trainer: string;
  trainingMaterials: string[];
  usersToTrain: number;
  trainingSchedule: string;
  trainingDeliveryMethod: 'On-site' | 'Virtual' | 'Hybrid';
  milestoneTracking: { milestone: string; date: string; status: 'Completed' | 'In-progress' | 'Pending' }[];
  statusUpdates: { date: string; update: string }[];
  issuesLog: string;
  changeRequests: string;
}

export interface GoLiveAndSupportData {
  uatCompleteDate: string;
  goLiveDate: string;
  systemCutoverDate: string;
  deploymentStatus: 'Completed' | 'In-progress' | 'Pending';
  trainingCompletionDate: string;
  trainingEffectivenessScore: number;
  userAdoptionRate: number;
  supportStartDate: string;
  supportEndDate: string;
  knownIssues: string;
  successCriteriaMet: 'Yes' | 'No';
  successCriteriaNotes: string;
  clientSatisfactionScore: number;
}

export interface BillingAndHandoffData {
  firstInvoiceDate: string;
  firstInvoiceAmount: number;
  invoiceStatus: 'Sent' | 'Received' | 'Paid';
  paymentDueDate: string;
  revenueRecognitionDate: string;
  clientOnboardingComplete: 'Yes' | 'No';
  accountManager: string;
  projectSuccessRating: 'High' | 'Medium' | 'Low';
  lessonsLearned: string;
  referralRequestMade: 'Yes' | 'No';
  caseStudyOpportunity: 'Yes' | 'No';
}

export interface ChangeOrderData {
  id: string;
  type: 'Scope' | 'Time' | 'Cost';
  parentOpportunityId: string;
  requestedBy: string;
  description: string;
  impactAnalysis: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  value: number;
  implementationDate: string;
  updatedTimeline: string;
  updatedBudget: number;
  documentationUrl: string;
  auditTrail: { date: string; action: string; user: string }[];
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
  entity: 'Lead' | 'Campaign' | 'Proposal' | 'System';
  entityId: string;
}

export interface ScheduledFollowUp {
  id: string;
  subject: string;
  body: string;
  scheduledDate: string;
  status: 'Scheduled' | 'Sent' | 'Failed';
}

export interface Lead {
  id: string;
  title: string; // Proposed Offering
  company: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '501+';
  industry: string;
  score: number;
  status: LeadStatus;
  stage: LeadStage;
  statusHistory: StatusUpdate[];
  priority: 'High' | 'Medium' | 'Low';
  columnId: string;
  ownerId: string;
  entryDate: string;
  lastContact: string;
  nextAction: string;
  source: string;
  campaignId?: string;
  region: string;
  contact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  followUpCadence: {
      date: string;
      method: 'Email' | 'Call' | 'LinkedIn' | 'Meeting';
      notes?: string;
  }[];
  scheduledFollowUps?: ScheduledFollowUp[];
  prospectData?: ProspectData;
  futureOpportunityData?: FutureOpportunityData;
  disqualifiedData?: DisqualifiedData;
  proposalData?: ProposalData;
  internalReviewData?: InternalReviewData;
  clientDeliveryData?: ClientDeliveryData;
  contractData?: ContractData;
  implementationAndTrainingData?: ImplementationAndTrainingData;
  goLiveAndSupportData?: GoLiveAndSupportData;
  billingAndHandoffData?: BillingAndHandoffData;
  changeOrders?: ChangeOrderData[];
  marketingCampaign?: string;
}

export interface Column {
  id: string;
  title: string;
}

export let users: User[] = [
  { id: 'user-1', name: 'Alex Johnson', email: 'alex.j@oncosparc.com', role: 'Admin', avatar: 'https://placehold.co/100x100.png' },
  { id: 'user-2', name: 'Maria Garcia', email: 'maria.g@oncosparc.com', role: 'Sales Rep', avatar: 'https://placehold.co/100x100.png' },
  { id: 'user-3', name: 'James Smith', email: 'james.s@oncosparc.com', role: 'Sales Rep', avatar: 'https://placehold.co/100x100.png' },
];

export let columns: Column[] = [
  { id: 'col-1', title: 'New Lead' },
  { id: 'col-2', title: 'Contacted' },
  { id: 'col-prospect', title: 'Prospect' },
  { id: 'col-proposal', title: 'Proposal' },
  { id: 'col-review', title: 'Internal Review' },
  { id: 'col-delivery', title: 'Client Delivery' },
  { id: 'col-contract', title: 'Contract' },
  { id: 'col-implementation', title: 'Implementation' },
  { id: 'col-go-live', title: 'Go-Live' },
  { id: 'col-billing', title: 'Billing & Handoff' },
  { id: 'col-5', title: 'Closed Won' },
];

export let campaigns: Campaign[] = [
  { 
    id: 'campaign-1', 
    name: 'Summer Promo 2024', 
    type: 'Digital', 
    startDate: '2024-06-01T10:00:00Z', 
    endDate: '2024-08-31T10:00:00Z',
    budget: 20000,
    description: 'Digital marketing campaign for summer season.',
    targetAudience: 'E-commerce businesses',
    keyMessages: 'Boost your summer sales with our new tools.',
    goals: 'Generate 200 new leads.'
  },
  { 
    id: 'campaign-2', 
    name: 'Retail Expo 2024', 
    type: 'Trade Show', 
    startDate: '2024-04-15T10:00:00Z', 
    endDate: '2024-04-18T10:00:00Z',
    budget: 50000,
    description: 'Annual retail industry trade show.',
    targetAudience: 'Brick-and-mortar retail owners',
    keyMessages: 'Modernize your retail experience.',
    goals: 'Get 50 qualified leads.'
  },
  { 
    id: 'campaign-3', 
    name: 'CyberCon 2024', 
    type: 'Conference', 
    startDate: '2024-05-10T10:00:00Z', 
    endDate: '2024-05-12T10:00:00Z',
    budget: 75000,
    description: 'Major cybersecurity conference.',
    targetAudience: 'CISOs and IT security managers',
    keyMessages: 'The future of enterprise security.',
    goals: 'Network with industry leaders, book 30 meetings.'
  }
];

export let leads: Lead[] = [
  {
    id: 'lead-1',
    title: 'Website Redesign Project',
    company: 'Innovate Corp',
    companySize: '51-200',
    industry: 'Technology',
    score: 85,
    priority: 'High',
    columnId: 'col-1',
    ownerId: 'user-2',
    entryDate: '2024-05-01T10:00:00Z',
    lastContact: '2024-05-20T10:00:00Z',
    nextAction: '2024-06-05T10:00:00Z',
    source: 'Website',
    status: 'Unaware',
    stage: 'Lead',
    statusHistory: [
      { status: 'Unaware', date: '2024-05-01T10:00:00Z', notes: 'Initial import from website form.', updatedBy: 'system' }
    ],
    campaignId: 'campaign-1',
    region: 'North America',
    contact: {
      name: 'Jane Doe',
      title: 'Marketing Director',
      email: 'jane.doe@innovatecorp.com',
      phone: '123-456-7890',
    },
    followUpCadence: [
        { date: '2024-05-02T11:00:00Z', method: 'Email' },
        { date: '2024-05-09T15:30:00Z', method: 'Call' },
    ],
  },
  {
    id: 'lead-2',
    title: 'Cloud Migration Services',
    company: 'DataSolutions Inc.',
    companySize: '501+',
    industry: 'Finance',
    score: 92,
    priority: 'High',
    columnId: 'col-prospect',
    ownerId: 'user-3',
    entryDate: '2024-05-03T12:00:00Z',
    lastContact: '2024-05-28T14:30:00Z',
    nextAction: '2024-06-02T14:30:00Z',
    source: 'Referral',
    status: 'Qualified',
    stage: 'Opportunity',
    statusHistory: [
       { status: 'Unaware', date: '2024-05-03T12:00:00Z', notes: 'Initial import from referral.', updatedBy: 'system' },
       { status: 'Engaged', date: '2024-05-05T09:00:00Z', notes: 'Responded to initial email.', updatedBy: 'user-3' },
       { status: 'Prospect', date: '2024-05-07T10:00:00Z', notes: 'Lead has shown high intent.', updatedBy: 'user-2' },
       { status: 'Qualified', date: '2024-05-28T14:30:00Z', notes: 'Budget, authority, need, and timeline confirmed.', updatedBy: 'user-3' },
    ],
    region: 'EMEA',
    contact: {
      name: 'John Smith',
      title: 'CTO',
      email: 'john.smith@datasolutions.com',
      phone: '234-567-8901',
    },
    followUpCadence: [
        { date: '2024-05-05T09:00:00Z', method: 'Email' },
        { date: '2024-05-15T10:00:00Z', method: 'Meeting' },
    ],
  },
  {
    id: 'lead-3',
    title: 'HR Software Implementation',
    company: 'PeopleFirst HR',
    companySize: '201-500',
    industry: 'Human Resources',
    score: 65,
    priority: 'Medium',
    columnId: 'col-2',
    ownerId: 'user-2',
    entryDate: '2024-05-05T14:00:00Z',
    lastContact: '2024-05-15T09:00:00Z',
    nextAction: '2024-06-10T09:00:00Z',
    source: 'Cold Call',
    status: 'Prospect',
    stage: 'Lead',
     statusHistory: [
       { status: 'Unaware', date: '2024-05-05T14:00:00Z', notes: 'Sourced from list.', updatedBy: 'system' },
       { status: 'Engaged', date: '2024-05-06T16:00:00Z', notes: 'Positive initial call.', updatedBy: 'user-2' },
       { status: 'Prospect', date: '2024-05-07T10:00:00Z', notes: 'Lead has shown high intent.', updatedBy: 'user-2' },
    ],
    region: 'APAC',
    contact: {
      name: 'Emily White',
      title: 'HR Manager',
      email: 'emily.w@peoplefirst.com',
      phone: '345-678-9012',
    },
    followUpCadence: [
        { date: '2024-05-06T16:00:00Z', method: 'Call' },
    ],
    prospectData: {
      responseDate: '2024-05-07T10:00:00Z',
      engagementType: 'Email reply',
      contactQuality: 'Decision maker',
      qualificationNotes: 'Expressed high-level interest in improving employee onboarding.',
      demoScheduled: 'Yes',
      demoDate: '2024-05-20T14:00:00Z',
      competitorAwareness: 'Mentioned they looked at BambooHR.',
      painPoints: 'Current onboarding is manual and time-consuming.',
      nextSteps: 'Follow up with a detailed proposal after the demo.',
    },
  },
    {
    id: 'lead-4',
    title: 'Marketing Automation Setup',
    company: 'GrowthHackers Ltd.',
    companySize: '11-50',
    industry: 'Marketing',
    score: 78,
    priority: 'Medium',
    columnId: 'col-1',
    ownerId: 'user-3',
    entryDate: '2024-05-10T09:00:00Z',
    lastContact: '2024-05-29T11:00:00Z',
    nextAction: '2024-06-04T11:00:00Z',
    source: 'LinkedIn',
    status: 'Unaware',
    stage: 'Lead',
    statusHistory: [],
    region: 'North America',
    contact: {
      name: 'Michael Brown',
      title: 'Head of Growth',
      email: 'mb@growthhackers.com',
      phone: '456-789-0123',
    },
    followUpCadence: [],
  },
  {
    id: 'lead-5',
    title: 'E-commerce Platform',
    company: 'Shopify Gurus',
    companySize: '51-200',
    industry: 'Retail',
    score: 88,
    priority: 'High',
    columnId: 'col-proposal',
    ownerId: 'user-2',
    entryDate: '2024-05-11T13:00:00Z',
    lastContact: '2024-05-25T16:00:00Z',
    nextAction: '2024-06-01T16:00:00Z',
    source: 'Partner',
    status: 'Qualified',
    stage: 'Proposal',
    statusHistory: [],
    campaignId: 'campaign-2',
    region: 'EMEA',
    contact: {
      name: 'Sarah Green',
      title: 'CEO',
      email: 'sarah.g@shopifygurus.com',
      phone: '567-890-1234',
    },
    followUpCadence: [
        { date: '2024-05-12T10:00:00Z', method: 'Email' },
        { date: '2024-05-19T14:00:00Z', method: 'Meeting' },
    ],
    proposalData: {
      templateUsed: 'Enterprise E-commerce v2.1',
      servicesIncluded: 'Platform setup, custom theme, data migration, 2 months support',
      pricingStructure: 'Fixed',
      projectDuration: '4 months',
      resourceRequirements: '1 PM, 2 Devs, 1 QA',
      termsVersion: 'v3.2',
      revisionHistory: [{ 
        version: 1, 
        date: '2024-05-26T10:00:00Z', 
        notes: 'Initial draft',
        previousState: {
          templateUsed: 'Enterprise E-commerce v2.0',
          servicesIncluded: 'Platform setup, custom theme, data migration',
          pricingStructure: 'Fixed',
          projectDuration: '3 months',
          resourceRequirements: '1 PM, 1 Dev, 1 QA',
          termsVersion: 'v3.1',
        }
      }],
    },
  },
  {
    id: 'lead-6',
    title: 'Custom Analytics Dashboard',
    company: 'Metrics Master',
    companySize: '1-10',
    industry: 'SaaS',
    score: 72,
    priority: 'Medium',
    columnId: 'col-review',
    ownerId: 'user-3',
    entryDate: '2024-05-12T16:00:00Z',
    lastContact: '2024-05-18T12:00:00Z',
    nextAction: '2024-06-08T12:00:00Z',
    source: 'Webinar',
    status: 'Qualified',
    stage: 'Proposal',
    statusHistory: [],
    region: 'APAC',
    contact: {
      name: 'Kevin Lee',
      title: 'Data Scientist',
      email: 'kevin.l@metricsmaster.com',
      phone: '678-901-2345',
    },
    followUpCadence: [
        { date: '2024-05-13T11:00:00Z', method: 'Email' },
    ],
    internalReviewData: {
        cstReviewStatus: 'Approved',
        cstReviewer: 'Tech Lead A',
        cstReviewDate: '2024-05-20T10:00:00Z',
        technicalFeasibilityNotes: 'Standard dashboard build, no issues.',
        resourceAvailabilityCheck: 'Completed',
        croReviewStatus: 'Pending',
    },
  },
    {
    id: 'lead-7',
    title: 'Enterprise Security Audit',
    company: 'SecureNet',
    companySize: '501+',
    industry: 'Cybersecurity',
    score: 95,
    priority: 'High',
    columnId: 'col-delivery',
    ownerId: 'user-2',
    entryDate: '2024-05-15T11:00:00Z',
    lastContact: '2024-05-22T15:00:00Z',
    nextAction: '2024-06-03T15:00:00Z',
    source: 'Conference',
    status: 'Qualified',
    stage: 'Client-Delivery',
    statusHistory: [],
    campaignId: 'campaign-3',
    region: 'North America',
    contact: {
      name: 'David Chen',
      title: 'CISO',
      email: 'david.c@securenet.com',
      phone: '789-012-3456',
    },
    followUpCadence: [
        { date: '2024-05-16T10:00:00Z', method: 'LinkedIn' },
        { date: '2024-05-22T15:00:00Z', method: 'Meeting' },
    ],
    clientDeliveryData: {
        proposalSentDate: '2024-05-23T10:00:00Z',
        proposalPresentationDate: '2024-05-25T14:00:00Z',
        presentationMethod: 'Virtual',
        attendees: 'David Chen (CISO), Sarah (IT Manager)',
        decisionMakerPresent: 'Yes',
        clientFeedback: 'Positive feedback on the thoroughness of the proposal.',
        clientQuestions: 'Questions about post-audit support and remediation services.',
        additionalRequirements: 'Requested a detailed timeline for the audit process.',
        competitiveSituationUpdate: 'They are also talking to a competitor, but feel our proposal is more comprehensive.',
        proposalRevisionRequested: 'Yes',
        followUpActions: 'Send revised proposal with timeline and pricing for remediation services.',
        decisionTimeline: 'End of month.',
    },
  },
  {
    id: 'lead-8',
    title: 'Logistics Software Upgrade',
    company: 'Global Transit',
    companySize: '201-500',
    industry: 'Logistics',
    score: 35,
    priority: 'Low',
    columnId: 'col-contract',
    ownerId: 'user-3',
    entryDate: '2024-04-20T09:00:00Z',
    lastContact: '2024-05-01T10:00:00Z',
    nextAction: '2024-06-20T10:00:00Z',
    source: 'Ad Campaign',
    status: 'Qualified',
    stage: 'Client-Delivery',
    statusHistory: [],
    region: 'EMEA',
    contact: {
      name: 'Fatima Ahmed',
      title: 'Operations Manager',
      email: 'fatima.a@globaltransit.com',
      phone: '890-123-4567',
    },
    followUpCadence: [
        { date: '2024-04-21T14:00:00Z', method: 'Email' },
    ],
    contractData: {
      templateUsed: 'Enterprise Logistics v4',
      version: 'v1.2',
      legalReviewRequired: 'Yes',
      legalReviewer: 'Legal Team',
      sentDate: '2024-06-01T10:00:00Z',
      clientReviewStatus: 'Reviewed',
      redlinesRequested: 'Minor changes to indemnity clause.',
      negotiationLog: 'Agreed on changes via call on 2024-06-05.',
      finalDate: '2024-06-06T10:00:00Z',
      signedDate: '2024-06-07T10:00:00Z',
      finalValue: 155000,
      paymentTerms: 'Net 30',
      keyClauses: 'SLA for uptime, Data privacy, Support terms.',
      renewalTerms: 'Auto-renewal with 60-day notice.',
      projectSuccessCriteria: '99.9% uptime, Go-live by Q4, User adoption rate of 90%.',
    },
  },
  {
    id: 'lead-9',
    title: 'AI Chatbot Integration',
    company: 'FutureTech',
    companySize: '201-500',
    industry: 'AI',
    score: 91,
    priority: 'High',
    columnId: 'col-implementation',
    ownerId: 'user-1',
    entryDate: '2024-05-18T11:00:00Z',
    lastContact: '2024-06-10T15:00:00Z',
    nextAction: '2024-06-20T15:00:00Z',
    source: 'Conference',
    status: 'Qualified',
    stage: 'Implementation',
    statusHistory: [],
    region: 'North America',
    contact: {
      name: 'Ben Carter',
      title: 'Innovation Lead',
      email: 'ben.c@futuretech.com',
      phone: '901-234-5678',
    },
    followUpCadence: [],
    implementationAndTrainingData: {
      projectManager: 'Alex Johnson',
      implementationTeam: ['Dev A', 'Dev B'],
      clientPoc: 'Ben Carter',
      kickoffDate: '2024-06-15T10:00:00Z',
      goLiveDate: '2024-08-15T10:00:00Z',
      implementationPlanStatus: 'Created',
      resourceAllocation: '2 FTE for 2 months',
      trainingPlanStatus: 'Created',
      trainer: 'Alex Johnson',
      trainingMaterials: ['User Guide.pdf', 'Admin Manual.pdf'],
      usersToTrain: 50,
      trainingSchedule: 'Weekly sessions starting July 1st',
      trainingDeliveryMethod: 'Virtual',
      milestoneTracking: [
        { milestone: 'Phase 1 Complete', date: '2024-07-15T10:00:00Z', status: 'Completed' },
        { milestone: 'UAT Starts', date: '2024-08-01T10:00:00Z', status: 'In-progress' },
      ],
      statusUpdates: [{ date: '2024-06-20T10:00:00Z', update: 'Project kicked off, team introduced.' }],
      issuesLog: 'No major issues.',
      changeRequests: 'None.',
    },
    changeOrders: [
      {
        id: 'co-1',
        type: 'Scope',
        parentOpportunityId: 'lead-9',
        requestedBy: 'Ben Carter',
        description: 'Add support for French language.',
        impactAnalysis: 'Adds 2 weeks to timeline and $5,000 to cost.',
        status: 'Approved',
        approvedBy: 'Alex Johnson',
        value: 5000,
        implementationDate: '2024-07-20T10:00:00Z',
        updatedTimeline: 'New go-live date: 2024-08-29',
        updatedBudget: 93000,
        documentationUrl: '/docs/co-1.pdf',
        auditTrail: [
          { date: '2024-07-18T10:00:00Z', action: 'Created', user: 'Alex Johnson' },
          { date: '2024-07-19T14:00:00Z', action: 'Approved', user: 'Ben Carter' },
        ],
      }
    ]
  },
  {
    id: 'lead-10',
    title: 'Data Warehouse Setup',
    company: 'Analytics Pros',
    companySize: '51-200',
    industry: 'Data Analytics',
    score: 94,
    priority: 'High',
    columnId: 'col-go-live',
    ownerId: 'user-2',
    entryDate: '2024-03-01T10:00:00Z',
    lastContact: '2024-06-25T10:00:00Z',
    nextAction: '2024-07-01T10:00:00Z',
    source: 'Website',
    status: 'Qualified',
    stage: 'Post-Sales',
    statusHistory: [],
    region: 'North America',
    contact: {
      name: 'Linda Kim',
      title: 'Head of BI',
      email: 'linda.k@analyticspros.com',
      phone: '123-123-1234',
    },
    followUpCadence: [],
    goLiveAndSupportData: {
        uatCompleteDate: '2024-06-20T10:00:00Z',
        goLiveDate: '2024-06-25T10:00:00Z',
        systemCutoverDate: '2024-06-24T10:00:00Z',
        deploymentStatus: 'Completed',
        trainingCompletionDate: '2024-06-18T10:00:00Z',
        trainingEffectivenessScore: 9,
        userAdoptionRate: 95,
        supportStartDate: '2024-06-25T10:00:00Z',
        supportEndDate: '2024-07-25T10:00:00Z',
        knownIssues: 'Minor UI bug in reporting dashboard, fix scheduled.',
        successCriteriaMet: 'Yes',
        successCriteriaNotes: 'All key metrics achieved.',
        clientSatisfactionScore: 10,
    },
  },
  {
    id: 'lead-11',
    title: 'CRM Integration',
    company: 'Connectify',
    companySize: '201-500',
    industry: 'Software',
    score: 89,
    priority: 'High',
    columnId: 'col-billing',
    ownerId: 'user-3',
    entryDate: '2024-02-15T10:00:00Z',
    lastContact: '2024-07-01T10:00:00Z',
    nextAction: '2024-07-15T10:00:00Z',
    source: 'Referral',
    status: 'Qualified',
    stage: 'Post-Sales',
    statusHistory: [],
    region: 'EMEA',
    contact: {
      name: 'Marcus Wright',
      title: 'Sales Ops Director',
      email: 'marcus.w@connectify.com',
      phone: '321-321-4321',
    },
    followUpCadence: [],
    billingAndHandoffData: {
      firstInvoiceDate: '2024-07-01T10:00:00Z',
      firstInvoiceAmount: 55000,
      invoiceStatus: 'Sent',
      paymentDueDate: '2024-07-31T10:00:00Z',
      revenueRecognitionDate: '2024-07-01T10:00:00Z',
      clientOnboardingComplete: 'Yes',
      accountManager: 'Account Manager X',
      projectSuccessRating: 'High',
      lessonsLearned: 'Integration points were more complex than anticipated.',
      referralRequestMade: 'No',
      caseStudyOpportunity: 'Yes',
    },
  },
];

export let auditLogs: AuditLog[] = [
  {
    id: 'log-1',
    user: 'Alex Johnson',
    action: 'Created',
    entity: 'Lead',
    entityId: 'lead-1',
    timestamp: '2024-05-01T10:00:00Z',
    details: 'New lead "Website Redesign Project" created via website form.',
  },
  {
    id: 'log-2',
    user: 'Maria Garcia',
    action: 'Updated',
    entity: 'Lead',
    entityId: 'lead-1',
    timestamp: '2024-05-20T10:00:00Z',
    details: 'Logged a call with Jane Doe. Next action set to 2024-06-05.',
  },
  {
    id: 'log-3',
    user: 'System',
    action: 'Updated',
    entity: 'Lead',
    entityId: 'lead-3',
    timestamp: '2024-05-07T10:00:00Z',
    details: 'Lead stage changed from "Contacted" to "Prospect".',
  },
  {
    id: 'log-4',
    user: 'Alex Johnson',
    action: 'Deleted',
    entity: 'Campaign',
    entityId: 'campaign-old',
    timestamp: '2024-05-21T11:00:00Z',
    details: 'Deleted campaign "Old Spring Promo".',
  },
  {
    id: 'log-5',
    user: 'James Smith',
    action: 'Created',
    entity: 'Proposal',
    entityId: 'lead-5',
    timestamp: '2024-05-26T10:00:00Z',
    details: 'Created proposal for "E-commerce Platform".',
  },
];
