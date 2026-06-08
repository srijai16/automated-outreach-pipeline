

export interface Contact {
  personId: string;

  name: string;
  title: string;

  linkedinUrl: string;
  companyDomain: string;

  email?: string;
  emailStatus?: string;
  emailRevealed?: boolean;

  mobile?: string;
}