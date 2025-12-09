export enum DutyCategory {
  DESIGN_DEV = "Website Design & Development",
  UX_ACCESS = "UX/UI & Accessibility",
  CONTENT = "Content Management & Updates",
  FEATURES = "Feature Development (Engagement)",
  COMPLIANCE = "Government Standards Compliance",
  TESTING = "Testing (Usability/Responsiveness)",
  ANALYTICS = "Analytics & Reporting",
  SUPPORT = "Technical Support & Guidance"
}

export interface ReportItem {
  id: string;
  category: DutyCategory;
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned';
}

export interface AnalyticsData {
  pageViews: string;
  uniqueVisitors: string;
  bounceRate: string;
  avgSessionDuration: string;
}

export interface ReportData {
  employeeName: string;
  reportDate: string;
  weekEnding: string;
  items: ReportItem[];
  analytics: AnalyticsData;
  summary: string;
  challenges: string;
  nextSteps: string;
}

export const INITIAL_REPORT_DATA: ReportData = {
  employeeName: "",
  reportDate: new Date().toISOString().split('T')[0],
  weekEnding: "",
  items: [],
  analytics: {
    pageViews: "",
    uniqueVisitors: "",
    bounceRate: "",
    avgSessionDuration: ""
  },
  summary: "",
  challenges: "",
  nextSteps: ""
};

// Extracted from the JD
export const JD_DUTIES_MAP: Record<DutyCategory, string> = {
  [DutyCategory.DESIGN_DEV]: "Designs and develops intuitive, visually appealing, and accessible websites for various government ministries.",
  [DutyCategory.UX_ACCESS]: "Creates UX/UI designs that facilitate easy access to information for all citizens, including those with disabilities.",
  [DutyCategory.CONTENT]: "Works with content creators to ensure web content is current, relevant, and aligned with standards.",
  [DutyCategory.FEATURES]: "Develops features that enhance citizen engagement, such as feedback forms, surveys, and interactive elements.",
  [DutyCategory.COMPLIANCE]: "Ensures all designs comply with government standards for digital communication and branding.",
  [DutyCategory.TESTING]: "Conducts regular testing for usability, accessibility, and responsiveness across devices/browsers.",
  [DutyCategory.ANALYTICS]: "Monitors, analyses, and reports on web traffic and user engagement metrics.",
  [DutyCategory.SUPPORT]: "Provides technical support and guidance to staff in managing and updating website content."
};