import fs from 'fs';
import path from 'path';
import { PortfolioState } from './types';
import { profileData } from '../src/data/profile';
import { skillCategories, currentlyLearning } from '../src/data/skills';
import { projectsData } from '../src/data/projects';
import { educationData } from '../src/data/education';
import { certificationsData } from '../src/data/certifications';
import { socialLinks } from '../src/data/socialLinks';

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.resolve(process.cwd(), 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'portfolio.json');
const BACKUP_FILE = path.join(DATA_DIR, 'portfolio.backup.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialState(): PortfolioState {
  return {
    profile: profileData,
    skills: {
      categories: skillCategories,
      currentlyLearning: currentlyLearning,
    },
    projects: projectsData,
    education: educationData,
    certifications: certificationsData,
    socialLinks: socialLinks,
    lastUpdated: new Date().toISOString(),
  };
}

class PortfolioStore {
  private state: PortfolioState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): PortfolioState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as PortfolioState;
        return parsed;
      }
    } catch (err) {
      console.error('Failed to load portfolio.json, attempting backup...', err);
      try {
        if (fs.existsSync(BACKUP_FILE)) {
          const backupRaw = fs.readFileSync(BACKUP_FILE, 'utf-8');
          return JSON.parse(backupRaw) as PortfolioState;
        }
      } catch (backupErr) {
        console.error('Backup load also failed, falling back to initial data.', backupErr);
      }
    }

    // Initialize with default state and save
    const initial = getInitialState();
    this.saveStateToDisk(initial);
    return initial;
  }

  private saveStateToDisk(state: PortfolioState): void {
    const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
    const serialized = JSON.stringify(state, null, 2);

    try {
      // 1. Write to temp file
      fs.writeFileSync(tempFile, serialized, 'utf-8');

      // 2. If main file exists, backup first
      if (fs.existsSync(DATA_FILE)) {
        try {
          fs.copyFileSync(DATA_FILE, BACKUP_FILE);
        } catch (backupErr) {
          console.warn('Could not update backup file:', backupErr);
        }
      }

      // 3. Atomically rename temp file to main file
      fs.renameSync(tempFile, DATA_FILE);
    } catch (err) {
      console.error('Error saving portfolio state to disk:', err);
      // Clean up temp file if rename failed
      if (fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile);
        } catch (_) {}
      }
      throw new Error('Failed to persist portfolio data to storage');
    }
  }

  public get(): PortfolioState {
    return this.state;
  }

  public update(updater: (current: PortfolioState) => PortfolioState): PortfolioState {
    const nextState = updater(this.state);
    nextState.lastUpdated = new Date().toISOString();
    this.saveStateToDisk(nextState);
    this.state = nextState;
    return this.state;
  }

  public resetToDefault(): PortfolioState {
    const initial = getInitialState();
    this.saveStateToDisk(initial);
    this.state = initial;
    return this.state;
  }
}

export const portfolioStore = new PortfolioStore();
