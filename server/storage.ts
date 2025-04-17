import {
  type Volunteer, type InsertVolunteer,
  type Donation, type InsertDonation,
  type Partner, type InsertPartner,
  type Resource, type InsertResource,
  type HealthContent, type InsertHealthContent,
  type Admin, type InsertAdmin
} from "@shared/schema";

// Interface defining all storage operations
export interface IStorage {
  getAdmins(): Promise<Admin[]>
  createAdmin(admin: InsertAdmin): Promise<Admin[]>
  // Volunteer management operations
  getVolunteers(): Promise<Volunteer[]>;
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;

  // Donation tracking operations
  getDonations(): Promise<Donation[]>;
  createDonation(donation: InsertDonation): Promise<Donation>;

  // Partner management operations
  getPartners(): Promise<Partner[]>;
  createPartner(partner: InsertPartner): Promise<Partner>;

  // Resource management operations
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Health content management operations
  getHealthContent(): Promise<HealthContent[]>;
  getHealthContentById(id: number): Promise<HealthContent | null>;
  createHealthContent(content: InsertHealthContent): Promise<HealthContent>;
  updateHealthContent(id: number, content: Partial<InsertHealthContent>): Promise<HealthContent>;
  getHealthContentByStatus(status: string): Promise<HealthContent[]>;
}

// In-memory storage implementation using Maps
export class MemStorage implements IStorage {
  // Maps to store different types of data
  private volunteers: Map<number, Volunteer>;
  private donations: Map<number, Donation>;
  private partners: Map<number, Partner>;
  private resources: Map<number, Resource>;
  private healthContent: Map<number, HealthContent>;
  private admins: Map<number, Admin>;

  // Auto-incrementing IDs for each type
  private currentIds: { [key: string]: number };

  constructor() {
    // Initialize empty storage Maps
    this.volunteers = new Map();
    this.donations = new Map();
    this.partners = new Map();
    this.resources = new Map();
    this.healthContent = new Map();
    this.admins = new Map();

    // Initialize ID counters
    this.currentIds = {
      volunteers: 1,
      donations: 1,
      partners: 1,
      resources: 1,
      healthContent: 1,
      admins:1,
    };

    // Populate initial data
    this.initializeResources();
    this.initializePartners();
  }

  // Add sample resources for testing and demonstration
  private initializeResources() {
    const initialResources: InsertResource[] = [
      {
        title: "Understanding Anxiety",
        description: "Learn about anxiety disorders and coping mechanisms",
        category: "Mental Health 101",
        content: "Comprehensive guide about anxiety...",
        tags: ["anxiety", "mental health", "self-help"]
      },
      {
        title: "Meditation Basics",
        description: "Introduction to meditation practices",
        category: "Self-Care",
        content: "Guide to meditation techniques...",
        tags: ["meditation", "mindfulness", "wellness"]
      }
    ];

    initialResources.forEach(resource => this.createResource(resource));
  }

  // Add sample partners for testing and demonstration
  private initializePartners() {
    const initialPartners: InsertPartner[] = [
      {
        name: "Mental Health Foundation",
        description: "Leading mental health research organization",
        website: "https://example.com",
        logo: "mhf-logo",
        type: "collaborator"
      }
    ];

    initialPartners.forEach(partner => this.createPartner(partner));
  }

  async getAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values())
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin[]> {
    const id = this.currentIds.admins++;
    const newAdmin: Admin = { ...admin,id, createdAt: new Date()}
    this.admins.set(id, newAdmin)
    return [newAdmin]
  }

  // Volunteer operations
  async getVolunteers(): Promise<Volunteer[]> {
    return Array.from(this.volunteers.values());
  }

  async createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer> {
    const id = this.currentIds.volunteers++;
    const newVolunteer = { ...volunteer, id };
    this.volunteers.set(id, newVolunteer);
    return newVolunteer;
  }

  // Donation operations
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async createDonation(donation: InsertDonation): Promise<Donation> {
    const id = this.currentIds.donations++;
    const newDonation = { ...donation, id };
    this.donations.set(id, newDonation);
    return newDonation;
  }

  // Partner operations
  async getPartners(): Promise<Partner[]> {
    return Array.from(this.partners.values());
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const id = this.currentIds.partners++;
    const newPartner = { ...partner, id };
    this.partners.set(id, newPartner);
    return newPartner;
  }

  // Resource operations
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values()).filter(
      resource => resource.category === category
    );
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const id = this.currentIds.resources++;
    const newResource = { ...resource, id };
    this.resources.set(id, newResource);
    return newResource;
  }

  // Health content operations
  async getHealthContent(): Promise<HealthContent[]> {
    return Array.from(this.healthContent.values());
  }

  async getHealthContentById(id: number): Promise<HealthContent | null> {
    return this.healthContent.get(id) || null;
  }

  async createHealthContent(content: InsertHealthContent): Promise<HealthContent> {
    const id = this.currentIds.healthContent++;
    const now = new Date();
    const newContent = {
      ...content,
      id,
      createdAt: now,
      updatedAt: now,
      tags: content.tags || [],
    };
    this.healthContent.set(id, newContent);
    return newContent;
  }

  async updateHealthContent(
    id: number,
    content: Partial<InsertHealthContent>
  ): Promise<HealthContent> {
    const existing = await this.getHealthContentById(id);
    if (!existing) {
      throw new Error("Content not found");
    }
    const updated = {
      ...existing,
      ...content,
      updatedAt: new Date(),
    };
    this.healthContent.set(id, updated);
    return updated;
  }

  async getHealthContentByStatus(status: string): Promise<HealthContent[]> {
    return Array.from(this.healthContent.values()).filter(
      content => content.status === status
    );
  }
}

// Create and export a single instance of storage
export const storage = new MemStorage();