import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PatientPage extends BasePage {

  constructor(page: Page) {
    super(page);
  }

  async createPatient() {
    // will add later
  }

  async getPatientId(): Promise<string> {
    return '';
  }

}