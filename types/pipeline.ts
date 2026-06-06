export interface Company {
  domain: string;
}

export interface Contact {
  name: string;
  title: string;
  linkedinUrl: string;
  email?: string;
}

export interface PipelineResult {
  companies: Company[];
  contacts: Contact[];
}