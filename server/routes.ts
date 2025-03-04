import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVolunteerSchema, insertDonationSchema, insertHealthContentSchema } from "@shared/schema";
import Stripe from "stripe";

// Initialize Stripe with API key (uses test key if not provided)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_default", {
  apiVersion: "2025-02-24.acacia",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/resources - Fetch all resources or filter by category
  app.get("/api/resources", async (req, res) => {
    const category = req.query.category as string;
    // If category is provided, filter resources, otherwise return all
    const resources = category
      ? await storage.getResourcesByCategory(category)
      : await storage.getResources();
    res.json(resources);
  });

  // GET /api/partners - Fetch all partner organizations
  app.get("/api/partners", async (_req, res) => {
    const partners = await storage.getPartners();
    res.json(partners);
  });

  // POST /api/volunteers - Register a new volunteer
  app.post("/api/volunteers", async (req, res) => {
    // Validate volunteer data using Zod schema
    const parsedData = insertVolunteerSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ error: "Invalid volunteer data" });
    }
    const volunteer = await storage.createVolunteer(parsedData.data);
    res.json(volunteer);
  });

  // POST /api/donations/create-payment-intent - Create Stripe payment intent
  app.post("/api/donations/create-payment-intent", async (req, res) => {
    // Validate donation data using Zod schema
    const parsedData = insertDonationSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ error: "Invalid donation data" });
    }

    try {
      // Create a Stripe payment intent for the donation
      const paymentIntent = await stripe.paymentIntents.create({
        amount: parsedData.data.amount * 100, // Convert to cents for Stripe
        currency: "usd",
        metadata: {
          email: parsedData.data.email,
          name: parsedData.data.name,
        },
      });

      // Return the client secret for completing payment on frontend
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // POST /api/donations/confirm - Record a completed donation
  app.post("/api/donations/confirm", async (req, res) => {
    // Validate donation data using Zod schema
    const parsedData = insertDonationSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ error: "Invalid donation data" });
    }

    // Store the donation record
    const donation = await storage.createDonation(parsedData.data);
    res.json(donation);
  });

  // GET /api/health-content - Fetch all health content
  app.get("/api/health-content", async (_req, res) => {
    const content = await storage.getHealthContent();
    res.json(content);
  });

  // GET /api/health-content/:id - Fetch single content
  app.get("/api/health-content/:id", async (req, res) => {
    const content = await storage.getHealthContentById(Number(req.params.id));
    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }
    res.json(content);
  });

  // POST /api/health-content - Create new content
  app.post("/api/health-content", async (req, res) => {
    const parsedData = insertHealthContentSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ error: "Invalid content data" });
    }
    const content = await storage.createHealthContent(parsedData.data);
    res.json(content);
  });

  // PATCH /api/health-content/:id - Update content
  app.patch("/api/health-content/:id", async (req, res) => {
    const parsedData = insertHealthContentSchema.partial().safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ error: "Invalid content data" });
    }
    try {
      const content = await storage.updateHealthContent(
        Number(req.params.id),
        parsedData.data
      );
      res.json(content);
    } catch (error) {
      res.status(404).json({ error: "Content not found" });
    }
  });

  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}