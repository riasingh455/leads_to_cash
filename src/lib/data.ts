export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Sales Rep';
  avatar: string;
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

export interface Lead {
  id: string;
  title: string; // Proposed Offering
  company: string;
  companySize: '1-10' | '11-50' | '51-200' | '201-500' | '501+';
  industry: string;
  value: number;
  currency: 'USD' | 'EUR' | 'GBP';
  score: number;
  priority: 'High' | 'Medium' | 'Low';
  columnId: string;
  ownerId: string;
  entryDate: string;
  lastContact: string;
  nextAction: string;
  source: string;
  marketingCampaign?: string;
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
  }[];
  prospectData?: ProspectData;
}

export interface Column {
  id: string;
  title: string;
}

export const users: User[] = [
  { id: 'user-1', name: 'Alex Johnson', role: 'Admin', avatar: 'https://placehold.co/100x100.png' },
  { id: 'user-2', name: 'Maria Garcia', role: 'Sales Rep', avatar: 'https://placehold.co/100x100.png' },
  { id: 'user-3', name: 'James Smith', role: 'Sales Rep', avatar: 'https://placehold.co/100x100.png' },
];

export const columns: Column[] = [
  { id: 'col-1', title: 'New Lead' },
  { id: 'col-2', title: 'Contacted' },
  { id: 'col-prospect', title: 'Prospect'},
  { id: 'col-3', title: 'Qualified' },
  { id: 'col-4', title: 'Proposal' },
  { id: 'col-5', title: 'Closed Won' },
];

export const leads: Lead[] = [
  {
    id: 'lead-1',
    title: 'Website Redesign Project',
    company: 'Innovate Corp',
    companySize: '51-200',
    industry: 'Technology',
    value: 75000,
    currency: 'USD',
    score: 85,
    priority: 'High',
    columnId: 'col-1',
    ownerId: 'user-2',
    entryDate: '2024-05-01T10:00:00Z',
    lastContact: '2024-05-20T10:00:00Z',
    nextAction: '2024-06-05T10:00:00Z',
    source: 'Website',
    marketingCampaign: 'Summer_Promo_2024',
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
    value: 120000,
    currency: 'USD',
    score: 92,
    priority: 'High',
    columnId: 'col-2',
    ownerId: 'user-3',
    entryDate: '2024-05-03T12:00:00Z',
    lastContact: '2024-05-28T14:30:00Z',
    nextAction: '2024-06-02T14:30:00Z',
    source: 'Referral',
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
    value: 45000,
    currency: 'EUR',
    score: 65,
    priority: 'Medium',
    columnId: 'col-prospect',
    ownerId: 'user-2',
    entryDate: '2024-05-05T14:00:00Z',
    lastContact: '2024-05-15T09:00:00Z',
    nextAction: '2024-06-10T09:00:00Z',
    source: 'Cold Call',
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
    value: 30000,
    currency: 'USD',
    score: 78,
    priority: 'Medium',
    columnId: 'col-1',
    ownerId: 'user-3',
    entryDate: '2024-05-10T09:00:00Z',
    lastContact: '2024-05-29T11:00:00Z',
    nextAction: '2024-06-04T11:00:00Z',
    source: 'LinkedIn',
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
    value: 95000,
    currency: 'GBP',
    score: 88,
    priority: 'High',
    columnId: 'col-4',
    ownerId: 'user-2',
    entryDate: '2024-05-11T13:00:00Z',
    lastContact: '2024-05-25T16:00:00Z',
    nextAction: '2024-06-01T16:00:00Z',
    source: 'Partner',
    marketingCampaign: 'Retail_Expo_2024',
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
  },
  {
    id: 'lead-6',
    title: 'Custom Analytics Dashboard',
    company: 'Metrics Master',
    companySize: '1-10',
    industry: 'SaaS',
    value: 62000,
    currency: 'USD',
    score: 72,
    priority: 'Medium',
    columnId: 'col-2',
    ownerId: 'user-3',
    entryDate: '2024-05-12T16:00:00Z',
    lastContact: '2024-05-18T12:00:00Z',
    nextAction: '2024-06-08T12:00:00Z',
    source: 'Webinar',
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
  },
    {
    id: 'lead-7',
    title: 'Enterprise Security Audit',
    company: 'SecureNet',
    companySize: '501+',
    industry: 'Cybersecurity',
    value: 250000,
    currency: 'USD',
    score: 95,
    priority: 'High',
    columnId: 'col-3',
    ownerId: 'user-2',
    entryDate: '2024-05-15T11:00:00Z',
    lastContact: '2024-05-22T15:00:00Z',
    nextAction: '2024-06-03T15:00:00Z',
    source: 'Conference',
    marketingCampaign: 'CyberCon_2024',
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
  },
  {
    id: 'lead-8',
    title: 'Logistics Software Upgrade',
    company: 'Global Transit',
    companySize: '201-500',
    industry: 'Logistics',
    value: 150000,
    currency: 'EUR',
    score: 35,
    priority: 'Low',
    columnId: 'col-1',
    ownerId: 'user-3',
    entryDate: '2024-04-20T09:00:00Z',
    lastContact: '2024-05-01T10:00:00Z',
    nextAction: '2024-06-20T10:00:00Z',
    source: 'Ad Campaign',
    marketingCampaign: 'Logistics_World_Q2',
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
  },
];

    