export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Sales Rep';
  avatar: string;
}

export interface Lead {
  id: string;
  title: string;
  company: string;
  value: number;
  score: number;
  priority: 'High' | 'Medium' | 'Low';
  columnId: string;
  ownerId: string;
  lastContact: string;
  nextAction: string;
  source: string;
  industry: string;
  region: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
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
  { id: 'col-3', title: 'Qualified' },
  { id: 'col-4', title: 'Proposal' },
  { id: 'col-5', title: 'Closed Won' },
];

export const leads: Lead[] = [
  {
    id: 'lead-1',
    title: 'Website Redesign Project',
    company: 'Innovate Corp',
    value: 75000,
    score: 85,
    priority: 'High',
    columnId: 'col-1',
    ownerId: 'user-2',
    lastContact: '2024-05-20T10:00:00Z',
    nextAction: '2024-06-05T10:00:00Z',
    source: 'Website',
    industry: 'Technology',
    region: 'North America',
    contact: {
      name: 'Jane Doe',
      email: 'jane.doe@innovatecorp.com',
      phone: '123-456-7890',
    },
  },
  {
    id: 'lead-2',
    title: 'Cloud Migration Services',
    company: 'DataSolutions Inc.',
    value: 120000,
    score: 92,
    priority: 'High',
    columnId: 'col-2',
    ownerId: 'user-3',
    lastContact: '2024-05-28T14:30:00Z',
    nextAction: '2024-06-02T14:30:00Z',
    source: 'Referral',
    industry: 'Finance',
    region: 'EMEA',
    contact: {
      name: 'John Smith',
      email: 'john.smith@datasolutions.com',
      phone: '234-567-8901',
    },
  },
  {
    id: 'lead-3',
    title: 'HR Software Implementation',
    company: 'PeopleFirst HR',
    value: 45000,
    score: 65,
    priority: 'Medium',
    columnId: 'col-3',
    ownerId: 'user-2',
    lastContact: '2024-05-15T09:00:00Z',
    nextAction: '2024-06-10T09:00:00Z',
    source: 'Cold Call',
    industry: 'Human Resources',
    region: 'APAC',
    contact: {
      name: 'Emily White',
      email: 'emily.w@peoplefirst.com',
      phone: '345-678-9012',
    },
  },
    {
    id: 'lead-4',
    title: 'Marketing Automation Setup',
    company: 'GrowthHackers Ltd.',
    value: 30000,
    score: 78,
    priority: 'Medium',
    columnId: 'col-1',
    ownerId: 'user-3',
    lastContact: '2024-05-29T11:00:00Z',
    nextAction: '2024-06-04T11:00:00Z',
    source: 'LinkedIn',
    industry: 'Marketing',
    region: 'North America',
    contact: {
      name: 'Michael Brown',
      email: 'mb@growthhackers.com',
      phone: '456-789-0123',
    },
  },
  {
    id: 'lead-5',
    title: 'E-commerce Platform',
    company: 'Shopify Gurus',
    value: 95000,
    score: 88,
    priority: 'High',
    columnId: 'col-4',
    ownerId: 'user-2',
    lastContact: '2024-05-25T16:00:00Z',
    nextAction: '2024-06-01T16:00:00Z',
    source: 'Partner',
    industry: 'Retail',
    region: 'EMEA',
    contact: {
      name: 'Sarah Green',
      email: 'sarah.g@shopifygurus.com',
      phone: '567-890-1234',
    },
  },
  {
    id: 'lead-6',
    title: 'Custom Analytics Dashboard',
    company: 'Metrics Master',
    value: 62000,
    score: 72,
    priority: 'Medium',
    columnId: 'col-2',
    ownerId: 'user-3',
    lastContact: '2024-05-18T12:00:00Z',
    nextAction: '2024-06-08T12:00:00Z',
    source: 'Webinar',
    industry: 'SaaS',
    region: 'APAC',
    contact: {
      name: 'Kevin Lee',
      email: 'kevin.l@metricsmaster.com',
      phone: '678-901-2345',
    },
  },
    {
    id: 'lead-7',
    title: 'Enterprise Security Audit',
    company: 'SecureNet',
    value: 250000,
    score: 95,
    priority: 'High',
    columnId: 'col-3',
    ownerId: 'user-2',
    lastContact: '2024-05-22T15:00:00Z',
    nextAction: '2024-06-03T15:00:00Z',
    source: 'Conference',
    industry: 'Cybersecurity',
    region: 'North America',
    contact: {
      name: 'David Chen',
      email: 'david.c@securenet.com',
      phone: '789-012-3456',
    },
  },
  {
    id: 'lead-8',
    title: 'Logistics Software Upgrade',
    company: 'Global Transit',
    value: 150000,
    score: 35,
    priority: 'Low',
    columnId: 'col-1',
    ownerId: 'user-3',
    lastContact: '2024-05-01T10:00:00Z',
    nextAction: '2024-06-20T10:00:00Z',
    source: 'Ad Campaign',
    industry: 'Logistics',
    region: 'EMEA',
    contact: {
      name: 'Fatima Ahmed',
      email: 'fatima.a@globaltransit.com',
      phone: '890-123-4567',
    },
  },
];
