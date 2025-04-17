import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database schema for volunteer registrations
export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  skills: text("skills").notNull(), // Skills and qualifications
  availability: text("availability").notNull(), // When they can volunteer
  experience: text("experience").default("").notNull(), // Previous relevant experience
});

// Database schema for donations and financial contributions
export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  amount: integer("amount").notNull(), // Donation amount in USD
  email: text("email").notNull(), // Donor's email for receipt
  name: text("name").notNull(), // Donor's name
  message: text("message").default("").notNull(), // Optional message with donation
  anonymous: boolean("anonymous").default(false).notNull(), // Whether to hide donor's name
});

// Database schema for partner organizations
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  website: text("website").notNull(),
  logo: text("logo").notNull(), // URL or path to partner's logo
  type: text("type").notNull(), // Type of partnership (sponsor, collaborator, etc.)
});

// Database schema for educational resources and content
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "Mental Health 101", "Self-Care"
  content: text("content").notNull(), // Main content of the resource
  tags: text("tags").array().default([]).notNull(), // For categorization and search
});

// Database schema for mental health awareness content
export const healthContent = pgTable("health_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(), // Main content body
  summary: text("summary").notNull(), // Brief description
  category: text("category").notNull(), // e.g., "Anxiety", "Depression", "Wellness"
  author: text("author").notNull(),
  status: text("status").default("draft").notNull(), // draft or published
  publishedAt: timestamp("published_at"), // Publication date
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  tags: text("tags").array().default([]).notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// Create Zod schemas for input validation
export const insertVolunteerSchema = createInsertSchema(volunteers);
export const insertDonationSchema = createInsertSchema(donations);
export const insertPartnerSchema = createInsertSchema(partners);
export const insertResourceSchema = createInsertSchema(resources);
export const insertHealthContentSchema = createInsertSchema(healthContent);

// TypeScript types for inserting new records
export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type InsertResource = z.infer<typeof insertResourceSchema>;
export type InsertHealthContent = z.infer<typeof insertHealthContentSchema>;

// TypeScript types for reading existing records
export type Volunteer = typeof volunteers.$inferSelect;
export type Donation = typeof donations.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type Resource = typeof resources.$inferSelect;
export type HealthContent = typeof healthContent.$inferSelect;

export const insertAdminSchema = createInsertSchema(admins);
export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;
