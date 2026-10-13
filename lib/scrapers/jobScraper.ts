import axios from "axios";
import * as cheerio from "cheerio";
import JobOpportunity from "../models/JobOpportunity";
import { sendJobAlert } from "../mailer";

export interface ScrapedJob {
  company: string;
  title: string;
  type: "internship" | "bootcamp" | "job" | "cohort" | "other";
  description: string;
  url: string;
  location?: string;
  postedDate?: Date;
}

const COMPANIES = [
  { name: "Aqore Nepal", careerUrl: "https://www.aqorenepal.com/careers" },
  { name: "F1Soft", careerUrl: "https://www.f1soft.com/careers" },
];

async function scrapeCompany(company: typeof COMPANIES[0]): Promise<ScrapedJob[]> {
  try {
    const response = await axios.get(company.careerUrl, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    const jobs: ScrapedJob[] = [];
    return jobs;
  } catch (error: any) {
    return [];
  }
}

export async function scrapeAllJobs() {
  const allJobs: ScrapedJob[] = [];
  const savedJobs: any[] = [];
  
  for (const company of COMPANIES) {
    const jobs = await scrapeCompany(company);
    allJobs.push(...jobs);
  }
  
  return { total: allJobs.length, newJobs: savedJobs.length, jobs: savedJobs };
}

export function getCompanies() {
  return COMPANIES;
}
