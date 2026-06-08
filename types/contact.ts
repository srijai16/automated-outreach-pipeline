

export interface Contact {
  personId: string;

  name: string;
  title: string;

  linkedinUrl: string;

  email?: string;
  emailStatus?: string;
  emailRevealed?: boolean;

  mobile?: string;

  companyName?: string;
  companyDomain: string;
}