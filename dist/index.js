var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// index.ts
import "dotenv/config";
import express3 from "express";

// routes.ts
import { createServer } from "http";
import Stripe from "stripe";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  accountDeletionSchema: () => accountDeletionSchema,
  activityLogs: () => activityLogs,
  avatarUploadSchema: () => avatarUploadSchema,
  cancelSubscriptionSchema: () => cancelSubscriptionSchema,
  changePasswordSchema: () => changePasswordSchema,
  createPaymentIntentSchema: () => createPaymentIntentSchema,
  createSubscriptionSchema: () => createSubscriptionSchema,
  emailVerificationSchema: () => emailVerificationSchema,
  emailVerificationTokens: () => emailVerificationTokens,
  emailVerifications: () => emailVerifications,
  insertEmailVerificationTokenSchema: () => insertEmailVerificationTokenSchema,
  insertInvoiceSchema: () => insertInvoiceSchema,
  insertPackageViewTrackingSchema: () => insertPackageViewTrackingSchema,
  insertPaymentSchema: () => insertPaymentSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertQuoteSchema: () => insertQuoteSchema,
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertUserSchema: () => insertUserSchema,
  invoices: () => invoices,
  loginSchema: () => loginSchema,
  packageRecommendationSchema: () => packageRecommendationSchema,
  packageViewTracking: () => packageViewTracking,
  payments: () => payments,
  preferencesUpdateSchema: () => preferencesUpdateSchema,
  profileUpdateSchema: () => profileUpdateSchema,
  quotes: () => quotes,
  signupSchema: () => signupSchema,
  subscriptions: () => subscriptions,
  updatePaymentSchema: () => updatePaymentSchema,
  userProjects: () => userProjects,
  userSessions: () => userSessions,
  users: () => users
});
import {
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  serial,
  jsonb,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  company: varchar("company", { length: 200 }),
  phone: varchar("phone", { length: 20 }),
  jobTitle: varchar("job_title", { length: 150 }),
  industry: varchar("industry", { length: 100 }),
  companySize: varchar("company_size", { length: 50 }),
  website: varchar("website", { length: 255 }),
  address: text("address"),
  businessGoals: text("business_goals"),
  currentChallenges: text("current_challenges"),
  preferredBudget: varchar("preferred_budget", { length: 50 }),
  projectTimeline: varchar("project_timeline", { length: 50 }),
  referralSource: varchar("referral_source", { length: 100 }),
  marketingConsent: boolean("marketing_consent").default(false),
  profileComplete: boolean("profile_complete").default(false),
  recommendedPackage: varchar("recommended_package", { length: 100 }),
  recommendationScore: integer("recommendation_score"),
  recommendationReason: text("recommendation_reason"),
  recommendationDate: timestamp("recommendation_date"),
  isActive: boolean("is_active").default(true),
  role: varchar("role", { length: 20 }).default("user"),
  // user, admin
  avatar: text("avatar"),
  // Base64 or URL for profile picture
  emailVerified: boolean("email_verified").default(false),
  preferences: jsonb("preferences").$type().default({ theme: "light", notifications: true, language: "en", timezone: "UTC" }),
  subscription: jsonb("subscription").$type(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var emailVerificationTokens = pgTable("email_verification_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var packageViewTracking = pgTable("package_view_tracking", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id", { length: 255 }),
  packageName: varchar("package_name", { length: 100 }).notNull(),
  packageType: varchar("package_type", { length: 100 }).notNull(),
  viewDuration: integer("view_duration"),
  // in seconds
  pageUrl: varchar("page_url", { length: 500 }),
  userAgent: text("user_agent"),
  lastReminderSent: timestamp("last_reminder_sent"),
  viewCount: integer("view_count").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  goals: jsonb("goals").$type().notNull(),
  overspending: jsonb("overspending").$type().notNull(),
  outcomes: jsonb("outcomes").$type().notNull(),
  projectDescription: text("project_description").notNull(),
  timeline: text("timeline").notNull(),
  attachments: jsonb("attachments").$type().default([]),
  status: varchar("status", { length: 50 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var userProjects = pgTable("user_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  services: jsonb("services").default([]),
  packageType: varchar("package_type", { length: 100 }),
  totalCost: integer("total_cost").default(0),
  paidAmount: integer("paid_amount").default(0),
  status: varchar("status", { length: 50 }).default("planning"),
  progress: integer("progress").default(0),
  startDate: timestamp("start_date"),
  estimatedCompletion: timestamp("estimated_completion"),
  milestones: jsonb("milestones").default([]),
  timeline: jsonb("timeline").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  adminId: integer("admin_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 100 }).notNull(),
  target: varchar("target", { length: 100 }),
  // user, quote, project, etc.
  targetId: integer("target_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var emailVerifications = pgTable("email_verifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  projectId: integer("project_id").references(() => userProjects.id, { onDelete: "cascade" }),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  amount: integer("amount").notNull(),
  // Amount in cents
  currency: varchar("currency", { length: 3 }).default("usd"),
  status: varchar("status", { length: 50 }).default("pending"),
  // pending, succeeded, failed, canceled
  paymentMethod: varchar("payment_method", { length: 50 }),
  // card, apple_pay, google_pay, paypal, bank_transfer
  paymentMethodDetails: jsonb("payment_method_details"),
  description: text("description"),
  metadata: jsonb("metadata"),
  receiptUrl: varchar("receipt_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  status: varchar("status", { length: 50 }).default("active"),
  // active, canceled, past_due, unpaid
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  canceledAt: timestamp("canceled_at"),
  packageType: varchar("package_type", { length: 100 }),
  amount: integer("amount"),
  // Amount in cents per billing period
  currency: varchar("currency", { length: 3 }).default("usd"),
  interval: varchar("interval", { length: 20 }),
  // month, year
  intervalCount: integer("interval_count").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id, { onDelete: "cascade" }),
  paymentId: integer("payment_id").references(() => payments.id, { onDelete: "set null" }),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 255 }).unique(),
  invoiceNumber: varchar("invoice_number", { length: 100 }),
  amount: integer("amount").notNull(),
  // Amount in cents
  amountPaid: integer("amount_paid").default(0),
  currency: varchar("currency", { length: 3 }).default("usd"),
  status: varchar("status", { length: 50 }).default("draft"),
  // draft, open, paid, void, uncollectible
  description: text("description"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  hostedInvoiceUrl: varchar("hosted_invoice_url", { length: 500 }),
  invoicePdf: varchar("invoice_pdf", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});
var signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  phone: z.string().optional(),
  marketingConsent: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  businessGoals: z.string().optional(),
  currentChallenges: z.string().optional(),
  preferredBudget: z.string().optional(),
  projectTimeline: z.string().optional(),
  referralSource: z.string().optional()
});
var packageRecommendationSchema = z.object({
  packageType: z.string(),
  score: z.number(),
  reason: z.string(),
  factors: z.array(z.object({
    factor: z.string(),
    weight: z.number(),
    value: z.string(),
    impact: z.number()
  }))
});
var avatarUploadSchema = z.object({
  avatar: z.string().min(1, "Avatar data is required")
});
var preferencesUpdateSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  notifications: z.boolean().default(true),
  language: z.enum(["en", "es", "fr", "de"]).default("en"),
  timezone: z.string().default("UTC")
});
var changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ["confirmPassword"]
});
var accountDeletionSchema = z.object({
  password: z.string().min(6, "Password is required to delete account"),
  confirmation: z.literal("DELETE", { errorMap: () => ({ message: "Please type DELETE to confirm" }) })
});
var emailVerificationSchema = z.object({
  token: z.string().min(1, "Verification token is required")
});
var createPaymentIntentSchema = z.object({
  amount: z.number().min(1, "Amount must be greater than 0"),
  currency: z.string().default("usd"),
  serviceId: z.string().optional(),
  planId: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional()
});
var createSubscriptionSchema = z.object({
  priceId: z.string().min(1, "Price ID is required"),
  packageType: z.string().min(1, "Package type is required"),
  paymentMethod: z.string().optional()
});
var updatePaymentSchema = z.object({
  status: z.enum(["pending", "succeeded", "failed", "canceled"]),
  paymentMethod: z.string().optional(),
  receiptUrl: z.string().optional()
});
var cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().min(1, "Subscription ID is required"),
  cancelAtPeriodEnd: z.boolean().default(true)
});
var insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertEmailVerificationTokenSchema = createInsertSchema(emailVerificationTokens).omit({
  id: true,
  createdAt: true
});
var insertPackageViewTrackingSchema = createInsertSchema(packageViewTracking).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true
});
var insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true
});
var insertProjectSchema = createInsertSchema(userProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// storage.ts
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// db-config.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
function getDatabaseConfig() {
  if (process.env.NEON_DATABASE_URL) {
    return {
      provider: "neon",
      connectionString: process.env.NEON_DATABASE_URL,
      description: "Using Neon PostgreSQL (cloud-hosted) - NEON_DATABASE_URL"
    };
  }
  if (process.env.DATABASE_URL && (process.env.DATABASE_URL.includes("neon.tech") || process.env.DATABASE_URL.includes("/2pal") || process.env.DATABASE_URL.includes("neondb_owner") || process.env.DATABASE_URL.includes("ep-raspy-feather"))) {
    return {
      provider: "neon",
      connectionString: process.env.DATABASE_URL,
      description: "Using Neon PostgreSQL (cloud-hosted) - DATABASE_URL detected as Neon"
    };
  }
  if (process.env.DATABASE_URL) {
    return {
      provider: "replit",
      connectionString: process.env.DATABASE_URL,
      description: "Using Replit PostgreSQL (auto-configured)"
    };
  }
  if (process.env.DB_PROVIDER === "neon") {
    throw new Error(
      "DB_PROVIDER is set to 'neon' but NEON_DATABASE_URL is not provided. Please set NEON_DATABASE_URL or remove DB_PROVIDER to use Replit PostgreSQL."
    );
  }
  throw new Error(
    "No database configuration found. Please ensure NEON_DATABASE_URL is set for the 2Pbal Neon database or DATABASE_URL is configured. Check NEON_DATABASE_SETUP.md for connection details."
  );
}
var dbConfig = getDatabaseConfig();
console.log(`[DB] ${dbConfig.description}`);
var pool = new Pool({ connectionString: dbConfig.connectionString });
var db = drizzle({ client: pool, schema: schema_exports });
var databaseProvider = dbConfig.provider;

// storage.ts
import { eq, desc, and } from "drizzle-orm";
var MemStorage = class {
  users = /* @__PURE__ */ new Map();
  sessions = /* @__PURE__ */ new Map();
  quotes = /* @__PURE__ */ new Map();
  projects = /* @__PURE__ */ new Map();
  activityLogs = /* @__PURE__ */ new Map();
  emailVerifications = /* @__PURE__ */ new Map();
  emailVerificationTokens = /* @__PURE__ */ new Map();
  packageViewTracking = /* @__PURE__ */ new Map();
  payments = /* @__PURE__ */ new Map();
  subscriptions = /* @__PURE__ */ new Map();
  invoices = /* @__PURE__ */ new Map();
  nextUserId = 1;
  nextQuoteId = 1;
  nextProjectId = 1;
  nextActivityId = 1;
  nextEmailVerificationTokenId = 1;
  nextPackageViewId = 1;
  nextPaymentId = 1;
  nextSubscriptionId = 1;
  nextInvoiceId = 1;
  constructor() {
    this.createAdminUser();
  }
  async createAdminUser() {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = {
      id: this.nextUserId++,
      email: "admin@2pbal.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      company: "2Pbal",
      phone: null,
      jobTitle: "Administrator",
      industry: "Technology",
      companySize: null,
      website: null,
      address: null,
      businessGoals: null,
      currentChallenges: null,
      preferredBudget: null,
      projectTimeline: null,
      referralSource: null,
      marketingConsent: false,
      profileComplete: true,
      recommendedPackage: null,
      recommendationScore: null,
      recommendationReason: null,
      recommendationDate: null,
      isActive: true,
      role: "admin",
      avatar: null,
      emailVerified: true,
      preferences: { theme: "light", notifications: true, language: "en", timezone: "UTC" },
      subscription: null,
      lastLogin: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(adminUser.id, adminUser);
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByEmail(email) {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return void 0;
  }
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = {
      id: this.nextUserId++,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      company: userData.company || null,
      phone: userData.phone || null,
      jobTitle: null,
      industry: null,
      companySize: null,
      website: null,
      address: null,
      businessGoals: null,
      currentChallenges: null,
      preferredBudget: null,
      projectTimeline: null,
      referralSource: null,
      marketingConsent: userData.marketingConsent || false,
      profileComplete: false,
      recommendedPackage: null,
      recommendationScore: null,
      recommendationReason: null,
      recommendationDate: null,
      isActive: true,
      role: "user",
      avatar: null,
      emailVerified: false,
      preferences: { theme: "light", notifications: true, language: "en", timezone: "UTC" },
      subscription: null,
      lastLogin: null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = {
      ...user,
      ...userData,
      updatedAt: /* @__PURE__ */ new Date(),
      profileComplete: true
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async updateUserWithRecommendation(id, userData, recommendation) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = {
      ...user,
      ...userData,
      profileComplete: true,
      recommendedPackage: recommendation.packageType,
      recommendationScore: recommendation.score,
      recommendationReason: recommendation.reason,
      recommendationDate: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async loginUser(credentials) {
    const user = await this.getUserByEmail(credentials.email);
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) return null;
    const updatedUser = { ...user, lastLogin: /* @__PURE__ */ new Date() };
    this.users.set(user.id, updatedUser);
    const session = await this.createSession(user.id);
    return { user: updatedUser, session };
  }
  async createSession(userId) {
    const sessionId = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    const session = {
      id: sessionId,
      userId,
      expiresAt,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.sessions.set(sessionId, session);
    return session;
  }
  async getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.expiresAt < /* @__PURE__ */ new Date()) {
      if (session) {
        await this.deleteSession(sessionId);
      }
      return void 0;
    }
    return session;
  }
  async deleteSession(sessionId) {
    this.sessions.delete(sessionId);
  }
  async createQuote(quoteData) {
    const quote = {
      id: this.nextQuoteId++,
      userId: quoteData.userId || null,
      // Remove name field as it doesn't exist in schema
      email: quoteData.email,
      company: quoteData.company || null,
      phone: quoteData.phone || null,
      goals: Array.isArray(quoteData.goals) ? quoteData.goals : [],
      overspending: Array.isArray(quoteData.overspending) ? quoteData.overspending : [],
      outcomes: Array.isArray(quoteData.outcomes) ? quoteData.outcomes : [],
      projectDescription: quoteData.projectDescription,
      timeline: quoteData.timeline,
      attachments: Array.isArray(quoteData.attachments) ? quoteData.attachments : [],
      status: quoteData.status || "pending",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.quotes.set(quote.id, quote);
    return quote;
  }
  async getQuotes(userId) {
    const allQuotes = Array.from(this.quotes.values());
    if (userId) {
      return allQuotes.filter((quote) => quote.userId === userId).sort(
        (a, b) => (b.createdAt ? b.createdAt.getTime() : 0) - (a.createdAt ? a.createdAt.getTime() : 0)
      );
    }
    return allQuotes.sort(
      (a, b) => (b.createdAt ? b.createdAt.getTime() : 0) - (a.createdAt ? a.createdAt.getTime() : 0)
    );
  }
  async getQuote(id) {
    return this.quotes.get(id);
  }
  async createProject(projectData) {
    const project = {
      id: this.nextProjectId++,
      userId: projectData.userId,
      name: projectData.name,
      description: projectData.description || null,
      services: projectData.services || [],
      packageType: projectData.packageType || null,
      totalCost: projectData.totalCost || 0,
      paidAmount: projectData.paidAmount || 0,
      status: projectData.status || "planning",
      progress: projectData.progress || 0,
      startDate: projectData.startDate || null,
      estimatedCompletion: projectData.estimatedCompletion || null,
      milestones: projectData.milestones || [],
      timeline: projectData.timeline || [],
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.projects.set(project.id, project);
    return project;
  }
  async getUserProjects(userId) {
    return Array.from(this.projects.values()).filter((project) => project.userId === userId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async getProject(id) {
    return this.projects.get(id);
  }
  async updateProject(id, data) {
    const project = this.projects.get(id);
    if (!project) return void 0;
    const updatedProject = {
      ...project,
      ...data,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }
  // Account management methods
  async deleteUser(id, password) {
    const user = this.users.get(id);
    if (!user) return false;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return false;
    this.users.delete(id);
    const sessionsToDelete = [];
    for (const [sessionId, session] of Array.from(this.sessions.entries())) {
      if (session.userId === id) {
        sessionsToDelete.push(sessionId);
      }
    }
    sessionsToDelete.forEach((sessionId) => this.sessions.delete(sessionId));
    return true;
  }
  async forceDeleteUser(id) {
    const user = this.users.get(id);
    if (!user) return false;
    this.users.delete(id);
    for (const [sessionId, session] of Array.from(this.sessions.entries())) {
      if (session.userId === id) {
        this.sessions.delete(sessionId);
      }
    }
    return true;
  }
  async changePassword(id, currentPassword, newPassword) {
    const user = this.users.get(id);
    if (!user) return false;
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) return false;
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = { ...user, password: hashedNewPassword, updatedAt: /* @__PURE__ */ new Date() };
    this.users.set(id, updatedUser);
    return true;
  }
  async updateAvatar(id, avatar) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = { ...user, avatar, updatedAt: /* @__PURE__ */ new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async updatePreferences(id, preferences) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences },
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  // Admin methods
  async getAllUsers() {
    return Array.from(this.users.values()).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async updateUserRole(userId, role) {
    const user = this.users.get(userId);
    if (!user) return void 0;
    const updatedUser = { ...user, role, updatedAt: /* @__PURE__ */ new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  // Activity logging
  async logActivity(activity) {
    const log2 = {
      id: this.nextActivityId++,
      userId: activity.userId || null,
      adminId: activity.adminId || null,
      action: activity.action,
      target: activity.target || null,
      targetId: activity.targetId || null,
      details: activity.details || null,
      ipAddress: activity.ipAddress || null,
      userAgent: activity.userAgent || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.activityLogs.set(log2.id, log2);
    return log2;
  }
  async getActivityLogs(userId, limit = 50) {
    const logs = Array.from(this.activityLogs.values());
    let filteredLogs = logs;
    if (userId) {
      filteredLogs = logs.filter((log2) => log2.userId === userId || log2.adminId === userId);
    }
    return filteredLogs.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)).slice(0, limit);
  }
  // Email verification
  async createEmailVerification(userId) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    const verification = {
      id: this.nextActivityId++,
      userId,
      token,
      expiresAt,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.emailVerifications.set(token, verification);
    return verification;
  }
  async verifyEmail(token) {
    const verification = this.emailVerifications.get(token);
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) {
      return false;
    }
    const user = this.users.get(verification.userId);
    if (!user) return false;
    const updatedUser = { ...user, emailVerified: true, updatedAt: /* @__PURE__ */ new Date() };
    this.users.set(user.id, updatedUser);
    this.emailVerifications.delete(token);
    return true;
  }
  // Email verification token operations
  async createEmailVerificationToken(userId, email) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    const verificationToken = {
      id: this.nextEmailVerificationTokenId++,
      userId,
      token,
      email,
      expiresAt,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.emailVerificationTokens.set(token, verificationToken);
    return verificationToken;
  }
  async getEmailVerificationToken(token) {
    const verification = this.emailVerificationTokens.get(token);
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) {
      if (verification) {
        this.emailVerificationTokens.delete(token);
      }
      return void 0;
    }
    return verification;
  }
  async verifyEmailToken(token) {
    const verification = this.emailVerificationTokens.get(token);
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) {
      return false;
    }
    const user = this.users.get(verification.userId);
    if (!user) return false;
    const updatedUser = { ...user, emailVerified: true, updatedAt: /* @__PURE__ */ new Date() };
    this.users.set(user.id, updatedUser);
    this.emailVerificationTokens.delete(token);
    return true;
  }
  async deleteEmailVerificationToken(token) {
    this.emailVerificationTokens.delete(token);
  }
  // Package tracking operations
  async trackPackageView(data) {
    const tracking = {
      id: this.nextPackageViewId++,
      ...data,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.packageViewTracking.set(tracking.id, tracking);
    return tracking;
  }
  async getPackageViewsForUser(userId) {
    return Array.from(this.packageViewTracking.values()).filter((view) => view.userId === userId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async getMostViewedPackageForUser(userId) {
    const userViews = await this.getPackageViewsForUser(userId);
    if (userViews.length === 0) return void 0;
    const packageStats = /* @__PURE__ */ new Map();
    for (const view of userViews) {
      const existing = packageStats.get(view.packageType);
      if (existing) {
        existing.count += view.viewCount || 1;
        existing.totalDuration += view.viewDuration || 0;
        if (view.createdAt && (!existing.latest.createdAt || view.createdAt > existing.latest.createdAt)) {
          existing.latest = view;
        }
      } else {
        packageStats.set(view.packageType, {
          count: view.viewCount || 1,
          totalDuration: view.viewDuration || 0,
          latest: view
        });
      }
    }
    let bestPackage;
    let bestScore = 0;
    for (const [packageType, stats] of packageStats) {
      const score = stats.count * 10 + stats.totalDuration;
      if (score > bestScore) {
        bestScore = score;
        bestPackage = stats.latest;
      }
    }
    return bestPackage;
  }
  async updateLastReminderSent(userId, packageType) {
    const views = await this.getPackageViewsForUser(userId);
    const relevantViews = views.filter((v) => v.packageType === packageType);
    for (const view of relevantViews) {
      const updatedView = { ...view, lastReminderSent: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() };
      this.packageViewTracking.set(view.id, updatedView);
    }
  }
  // Payment operations
  async createPayment(payment) {
    const newPayment = {
      id: this.nextPaymentId++,
      ...payment,
      metadata: payment.metadata || {},
      projectId: payment.projectId || null,
      status: payment.status || null,
      description: payment.description || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.payments.set(newPayment.id, newPayment);
    return newPayment;
  }
  async getPayment(id) {
    return this.payments.get(id);
  }
  async getPaymentByStripeId(stripePaymentIntentId) {
    return Array.from(this.payments.values()).find((p) => p.stripePaymentIntentId === stripePaymentIntentId);
  }
  async getUserPayments(userId) {
    return Array.from(this.payments.values()).filter((p) => p.userId === userId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async updatePayment(id, data) {
    const payment = this.payments.get(id);
    if (!payment) return void 0;
    const updatedPayment = { ...payment, ...data, updatedAt: /* @__PURE__ */ new Date() };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }
  // Subscription operations
  async createSubscription(subscription) {
    const newSubscription = {
      id: this.nextSubscriptionId++,
      ...subscription,
      amount: subscription.amount || null,
      stripeCustomerId: subscription.stripeCustomerId || null,
      status: subscription.status || null,
      packageType: subscription.packageType || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.subscriptions.set(newSubscription.id, newSubscription);
    return newSubscription;
  }
  async getSubscription(id) {
    return this.subscriptions.get(id);
  }
  async getSubscriptionByStripeId(stripeSubscriptionId) {
    return Array.from(this.subscriptions.values()).find((s) => s.stripeSubscriptionId === stripeSubscriptionId);
  }
  async getUserSubscriptions(userId) {
    return Array.from(this.subscriptions.values()).filter((s) => s.userId === userId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async getAllSubscriptions() {
    return Array.from(this.subscriptions.values()).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async updateSubscription(id, data) {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return void 0;
    const updatedSubscription = { ...subscription, ...data, updatedAt: /* @__PURE__ */ new Date() };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }
  // Invoice operations
  async createInvoice(invoice) {
    const newInvoice = {
      id: this.nextInvoiceId++,
      ...invoice,
      paymentId: invoice.paymentId || null,
      subscriptionId: invoice.subscriptionId || null,
      status: invoice.status || null,
      description: invoice.description || null,
      currency: invoice.currency || null,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.invoices.set(newInvoice.id, newInvoice);
    return newInvoice;
  }
  async getInvoice(id) {
    return this.invoices.get(id);
  }
  async getInvoiceByStripeId(stripeInvoiceId) {
    return Array.from(this.invoices.values()).find((i) => i.stripeInvoiceId === stripeInvoiceId);
  }
  async getUserInvoices(userId) {
    return Array.from(this.invoices.values()).filter((i) => i.userId === userId).sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }
  async updateInvoice(id, data) {
    const invoice = this.invoices.get(id);
    if (!invoice) return void 0;
    const updatedInvoice = { ...invoice, ...data, updatedAt: /* @__PURE__ */ new Date() };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }
};
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        phone: users.phone,
        isActive: users.isActive,
        role: users.role,
        emailVerified: users.emailVerified,
        profileComplete: users.profileComplete,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).where(eq(users.id, id)).limit(1);
      if (result[0]) {
        return {
          ...result[0],
          jobTitle: null,
          industry: null,
          companySize: null,
          website: null,
          address: null,
          businessGoals: null,
          currentChallenges: null,
          preferredBudget: null,
          projectTimeline: null,
          referralSource: null,
          marketingConsent: false,
          recommendedPackage: null,
          recommendationScore: null,
          recommendationReason: null,
          recommendationDate: null,
          avatar: null,
          preferences: { theme: "light", notifications: true, language: "en", timezone: "UTC" },
          subscription: null,
          lastLogin: null
        };
      }
      return void 0;
    } catch (error) {
      console.error("getUser error:", error);
      return void 0;
    }
  }
  async getUserByEmail(email) {
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        phone: users.phone,
        isActive: users.isActive,
        role: users.role,
        emailVerified: users.emailVerified,
        profileComplete: users.profileComplete,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).where(eq(users.email, email)).limit(1);
      if (result[0]) {
        return {
          ...result[0],
          jobTitle: null,
          industry: null,
          companySize: null,
          website: null,
          address: null,
          businessGoals: null,
          currentChallenges: null,
          preferredBudget: null,
          projectTimeline: null,
          referralSource: null,
          marketingConsent: false,
          recommendedPackage: null,
          recommendationScore: null,
          recommendationReason: null,
          recommendationDate: null,
          avatar: null,
          preferences: { theme: "light", notifications: true, language: "en", timezone: "UTC" },
          subscription: null,
          lastLogin: null
        };
      }
      return void 0;
    } catch (error) {
      console.error("getUserByEmail error:", error);
      return void 0;
    }
  }
  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const result = await db.insert(users).values({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      company: userData.company || null,
      phone: userData.phone || null,
      marketingConsent: userData.marketingConsent || false,
      emailVerified: false,
      profileComplete: false,
      isActive: true,
      role: "user"
    }).returning();
    return result[0];
  }
  async updateUser(id, userData) {
    const result = await db.update(users).set({ ...userData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return result[0];
  }
  async updateUserWithRecommendation(id, userData, recommendation) {
    const result = await db.update(users).set({
      ...userData,
      profileComplete: true,
      recommendedPackage: recommendation.packageType,
      recommendationScore: recommendation.score,
      recommendationReason: recommendation.reason,
      recommendationDate: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, id)).returning();
    return result[0];
  }
  async loginUser(credentials) {
    const user = await this.getUserByEmail(credentials.email);
    if (!user || !user.isActive) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    await db.update(users).set({ lastLogin: /* @__PURE__ */ new Date() }).where(eq(users.id, user.id));
    const session = await this.createSession(user.id);
    return { user, session };
  }
  async deleteUser(id, password) {
    const user = await this.getUser(id);
    if (!user) return false;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return false;
    await db.delete(users).where(eq(users.id, id));
    return true;
  }
  async forceDeleteUser(id) {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error("Force delete user error:", error);
      return false;
    }
  }
  async changePassword(id, currentPassword, newPassword) {
    const user = await this.getUser(id);
    if (!user) return false;
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) return false;
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await db.update(users).set({ password: hashedNewPassword, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id));
    return true;
  }
  async updateAvatar(id, avatar) {
    const result = await db.update(users).set({ avatar, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return result[0];
  }
  async updatePreferences(id, preferences) {
    const user = await this.getUser(id);
    if (!user) return void 0;
    const updatedPreferences = { ...user.preferences, ...preferences };
    const result = await db.update(users).set({ preferences: updatedPreferences, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, id)).returning();
    return result[0];
  }
  // Admin operations
  async getAllUsers() {
    try {
      const result = await db.select({
        id: users.id,
        email: users.email,
        password: users.password,
        firstName: users.firstName,
        lastName: users.lastName,
        company: users.company,
        phone: users.phone,
        isActive: users.isActive,
        role: users.role,
        emailVerified: users.emailVerified,
        profileComplete: users.profileComplete,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt
      }).from(users).orderBy(desc(users.createdAt));
      return result.map((user) => ({
        ...user,
        jobTitle: null,
        industry: null,
        companySize: null,
        website: null,
        address: null,
        businessGoals: null,
        currentChallenges: null,
        preferredBudget: null,
        projectTimeline: null,
        referralSource: null,
        marketingConsent: false,
        recommendedPackage: null,
        recommendationScore: null,
        recommendationReason: null,
        recommendationDate: null,
        avatar: null,
        preferences: { theme: "light", notifications: true, language: "en", timezone: "UTC" },
        subscription: null,
        lastLogin: null
      }));
    } catch (error) {
      console.error("getAllUsers error:", error);
      return [];
    }
  }
  async updateUserRole(userId, role) {
    const result = await db.update(users).set({ role, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
    return result[0];
  }
  // Session operations
  async createSession(userId) {
    const sessionId = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    const result = await db.insert(userSessions).values({
      id: sessionId,
      userId,
      expiresAt
    }).returning();
    return result[0];
  }
  async getSession(sessionId) {
    const result = await db.select().from(userSessions).where(and(
      eq(userSessions.id, sessionId)
      // Check if session hasn't expired
    )).limit(1);
    const session = result[0];
    if (!session || session.expiresAt < /* @__PURE__ */ new Date()) {
      if (session) {
        await this.deleteSession(sessionId);
      }
      return void 0;
    }
    return session;
  }
  async deleteSession(sessionId) {
    await db.delete(userSessions).where(eq(userSessions.id, sessionId));
  }
  // Quote operations
  async createQuote(quote) {
    const result = await db.insert(quotes).values({
      email: quote.email,
      company: quote.company || null,
      phone: quote.phone || null,
      goals: quote.goals,
      overspending: quote.overspending,
      outcomes: quote.outcomes,
      projectDescription: quote.projectDescription,
      timeline: quote.timeline,
      attachments: quote.attachments || [],
      status: quote.status || "pending"
    }).returning();
    return result[0];
  }
  async getQuotes(userId) {
    if (userId) {
      return await db.select().from(quotes).where(eq(quotes.userId, userId)).orderBy(desc(quotes.createdAt));
    }
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }
  async getQuote(id) {
    const result = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
    return result[0];
  }
  // Project operations
  async createProject(project) {
    const result = await db.insert(userProjects).values(project).returning();
    return result[0];
  }
  async getUserProjects(userId) {
    return await db.select().from(userProjects).where(eq(userProjects.userId, userId)).orderBy(desc(userProjects.createdAt));
  }
  async getProject(id) {
    const result = await db.select().from(userProjects).where(eq(userProjects.id, id)).limit(1);
    return result[0];
  }
  async updateProject(id, data) {
    const result = await db.update(userProjects).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userProjects.id, id)).returning();
    return result[0];
  }
  // Activity logging
  async logActivity(activity) {
    const result = await db.insert(activityLogs).values({
      userId: activity.userId || null,
      adminId: activity.adminId || null,
      action: activity.action,
      target: activity.target || null,
      targetId: activity.targetId || null,
      details: activity.details || null,
      ipAddress: activity.ipAddress || null,
      userAgent: activity.userAgent || null
    }).returning();
    return result[0];
  }
  async getActivityLogs(userId, limit = 50) {
    if (userId) {
      return await db.select().from(activityLogs).where(eq(activityLogs.userId, userId)).orderBy(desc(activityLogs.createdAt)).limit(limit);
    }
    return await db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
  }
  // Email verification
  async createEmailVerification(userId) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    const result = await db.insert(emailVerifications).values({
      userId,
      token,
      expiresAt
    }).returning();
    return result[0];
  }
  async verifyEmail(token) {
    const result = await db.select().from(emailVerifications).where(eq(emailVerifications.token, token)).limit(1);
    const verification = result[0];
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) {
      return false;
    }
    await db.update(users).set({ emailVerified: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, verification.userId));
    await db.delete(emailVerifications).where(eq(emailVerifications.token, token));
    return true;
  }
  // Payment operations
  async createPayment(payment) {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }
  async getPayment(id) {
    const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
    return result[0];
  }
  async getPaymentByStripeId(stripePaymentIntentId) {
    const result = await db.select().from(payments).where(eq(payments.stripePaymentIntentId, stripePaymentIntentId)).limit(1);
    return result[0];
  }
  async getUserPayments(userId) {
    return await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }
  async updatePayment(id, data) {
    const result = await db.update(payments).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(payments.id, id)).returning();
    return result[0];
  }
  // Subscription operations
  async createSubscription(subscription) {
    const result = await db.insert(subscriptions).values(subscription).returning();
    return result[0];
  }
  async getSubscription(id) {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
    return result[0];
  }
  async getSubscriptionByStripeId(stripeSubscriptionId) {
    const result = await db.select().from(subscriptions).where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId)).limit(1);
    return result[0];
  }
  async getUserSubscriptions(userId) {
    return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).orderBy(desc(subscriptions.createdAt));
  }
  async getAllSubscriptions() {
    return await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  }
  async updateSubscription(id, data) {
    const result = await db.update(subscriptions).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(subscriptions.id, id)).returning();
    return result[0];
  }
  // Invoice operations
  async createInvoice(invoice) {
    const result = await db.insert(invoices).values(invoice).returning();
    return result[0];
  }
  async getInvoice(id) {
    const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
    return result[0];
  }
  async getInvoiceByStripeId(stripeInvoiceId) {
    const result = await db.select().from(invoices).where(eq(invoices.stripeInvoiceId, stripeInvoiceId)).limit(1);
    return result[0];
  }
  async getUserInvoices(userId) {
    return await db.select().from(invoices).where(eq(invoices.userId, userId)).orderBy(desc(invoices.createdAt));
  }
  async updateInvoice(id, data) {
    const result = await db.update(invoices).set({ ...data, updatedAt: /* @__PURE__ */ new Date() }).where(eq(invoices.id, id)).returning();
    return result[0];
  }
  // Email verification token operations
  async createEmailVerificationToken(userId, email) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1e3);
    const result = await db.insert(emailVerificationTokens).values({
      userId,
      token,
      email,
      expiresAt
    }).returning();
    return result[0];
  }
  async getEmailVerificationToken(token) {
    const result = await db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.token, token)).limit(1);
    const verification = result[0];
    if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) {
      if (verification) {
        await this.deleteEmailVerificationToken(token);
      }
      return void 0;
    }
    return verification;
  }
  async verifyEmailToken(token) {
    const verification = await this.getEmailVerificationToken(token);
    if (!verification) return false;
    const result = await db.update(users).set({ emailVerified: true, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, verification.userId)).returning();
    if (result.length > 0) {
      await this.deleteEmailVerificationToken(token);
      return true;
    }
    return false;
  }
  async deleteEmailVerificationToken(token) {
    await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
  }
  // Package tracking operations
  async trackPackageView(data) {
    const result = await db.insert(packageViewTracking).values(data).returning();
    return result[0];
  }
  async getPackageViewsForUser(userId) {
    return await db.select().from(packageViewTracking).where(eq(packageViewTracking.userId, userId)).orderBy(desc(packageViewTracking.createdAt));
  }
  async getMostViewedPackageForUser(userId) {
    const userViews = await this.getPackageViewsForUser(userId);
    if (userViews.length === 0) return void 0;
    const packageStats = /* @__PURE__ */ new Map();
    for (const view of userViews) {
      const existing = packageStats.get(view.packageType);
      if (existing) {
        existing.count += view.viewCount || 1;
        existing.totalDuration += view.viewDuration || 0;
        if (view.createdAt && (!existing.latest.createdAt || view.createdAt > existing.latest.createdAt)) {
          existing.latest = view;
        }
      } else {
        packageStats.set(view.packageType, {
          count: view.viewCount || 1,
          totalDuration: view.viewDuration || 0,
          latest: view
        });
      }
    }
    let bestPackage;
    let bestScore = 0;
    for (const [packageType, stats] of packageStats) {
      const score = stats.count * 10 + stats.totalDuration;
      if (score > bestScore) {
        bestScore = score;
        bestPackage = stats.latest;
      }
    }
    return bestPackage;
  }
  async updateLastReminderSent(userId, packageType) {
    await db.update(packageViewTracking).set({ lastReminderSent: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(and(
      eq(packageViewTracking.userId, userId),
      eq(packageViewTracking.packageType, packageType)
    ));
  }
};
var storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

// recommendation-engine.ts
var PACKAGES = [
  {
    id: "basic",
    name: "Basic Digital Foundation",
    price: 29,
    targetBudget: { min: 0, max: 5e3 },
    targetCompanySize: ["1-10", "startup", "freelancer"],
    targetIndustries: ["retail", "service", "consulting", "creative"],
    targetTimeline: ["1-3 months", "3-6 months"],
    features: ["Website Design", "Basic SEO", "Social Media Setup"],
    suitabilityScore: (profile) => {
      let score = 0;
      const budgetMatch = getBudgetScore(profile.preferredBudget, 0, 5e3);
      score += budgetMatch * 0.3;
      const sizeMatch = getCompanySizeScore(profile.companySize, ["1-10", "startup", "freelancer"]);
      score += sizeMatch * 0.25;
      const timelineMatch = getTimelineScore(profile.projectTimeline, ["1-3 months", "3-6 months"]);
      score += timelineMatch * 0.2;
      const industryMatch = getIndustryScore(profile.industry, ["retail", "service", "consulting", "creative"]);
      score += industryMatch * 0.15;
      const goalsMatch = getGoalsScore(profile.businessGoals, ["online presence", "website", "basic marketing"]);
      score += goalsMatch * 0.1;
      return Math.min(score * 100, 100);
    }
  },
  {
    id: "professional",
    name: "Professional Growth Suite",
    price: 99,
    targetBudget: { min: 5e3, max: 25e3 },
    targetCompanySize: ["11-50", "small business"],
    targetIndustries: ["technology", "healthcare", "finance", "education", "manufacturing"],
    targetTimeline: ["3-6 months", "6-12 months"],
    features: ["Advanced Website", "E-commerce", "CRM Integration", "Analytics"],
    suitabilityScore: (profile) => {
      let score = 0;
      const budgetMatch = getBudgetScore(profile.preferredBudget, 5e3, 25e3);
      score += budgetMatch * 0.3;
      const sizeMatch = getCompanySizeScore(profile.companySize, ["11-50", "small business"]);
      score += sizeMatch * 0.25;
      const timelineMatch = getTimelineScore(profile.projectTimeline, ["3-6 months", "6-12 months"]);
      score += timelineMatch * 0.2;
      const industryMatch = getIndustryScore(profile.industry, ["technology", "healthcare", "finance", "education", "manufacturing"]);
      score += industryMatch * 0.15;
      const goalsMatch = getGoalsScore(profile.businessGoals, ["growth", "automation", "efficiency", "sales"]);
      score += goalsMatch * 0.1;
      return Math.min(score * 100, 100);
    }
  },
  {
    id: "enterprise",
    name: "Enterprise Transformation",
    price: 299,
    targetBudget: { min: 25e3, max: 1e5 },
    targetCompanySize: ["51-200", "201-500", "500+", "enterprise"],
    targetIndustries: ["technology", "finance", "healthcare", "manufacturing", "government"],
    targetTimeline: ["6-12 months", "12+ months"],
    features: ["Custom Development", "AI Integration", "Advanced Analytics", "Multi-platform Solutions"],
    suitabilityScore: (profile) => {
      let score = 0;
      const budgetMatch = getBudgetScore(profile.preferredBudget, 25e3, 1e5);
      score += budgetMatch * 0.3;
      const sizeMatch = getCompanySizeScore(profile.companySize, ["51-200", "201-500", "500+", "enterprise"]);
      score += sizeMatch * 0.25;
      const timelineMatch = getTimelineScore(profile.projectTimeline, ["6-12 months", "12+ months"]);
      score += timelineMatch * 0.2;
      const industryMatch = getIndustryScore(profile.industry, ["technology", "finance", "healthcare", "manufacturing", "government"]);
      score += industryMatch * 0.15;
      const goalsMatch = getGoalsScore(profile.businessGoals, ["transformation", "scale", "enterprise", "automation", "integration"]);
      score += goalsMatch * 0.1;
      return Math.min(score * 100, 100);
    }
  }
];
function getBudgetScore(userBudgets, minTarget, maxTarget) {
  if (!userBudgets) return 0.5;
  const budgetRanges = {
    "less than $5,000": { min: 0, max: 5e3 },
    "$5,000 - $15,000": { min: 5e3, max: 15e3 },
    "$15,000 - $50,000": { min: 15e3, max: 5e4 },
    "$50,000 - $100,000": { min: 5e4, max: 1e5 },
    "more than $100,000": { min: 1e5, max: 5e5 }
  };
  const userRange = budgetRanges[userBudgets];
  if (!userRange) return 0.5;
  const overlapMin = Math.max(userRange.min, minTarget);
  const overlapMax = Math.min(userRange.max, maxTarget);
  if (overlapMin <= overlapMax) {
    const overlapSize = overlapMax - overlapMin;
    const targetSize = maxTarget - minTarget;
    return overlapSize / targetSize;
  }
  return 0;
}
function getCompanySizeScore(userSize, targetSizes) {
  if (!userSize) return 0.5;
  const sizeMap = {
    "1-10": ["1-10", "startup", "freelancer", "small business"],
    "11-50": ["11-50", "small business"],
    "51-200": ["51-200", "medium business"],
    "201-500": ["201-500", "large business"],
    "500+": ["500+", "enterprise"]
  };
  const userCategories = sizeMap[userSize] || [userSize.toLowerCase()];
  const targetCategories = targetSizes.map((s) => s.toLowerCase());
  const intersection = userCategories.filter(
    (cat) => targetCategories.some((target) => cat.includes(target) || target.includes(cat))
  );
  return intersection.length > 0 ? 1 : 0;
}
function getTimelineScore(userTimeline, targetTimelines) {
  if (!userTimeline) return 0.5;
  const timelineMap = {
    "ASAP": 1,
    "1-3 months": 3,
    "3-6 months": 6,
    "6-12 months": 12,
    "12+ months": 18
  };
  const userTimeValue = timelineMap[userTimeline] || 6;
  return targetTimelines.some((target) => {
    const targetValue = timelineMap[target] || 6;
    return Math.abs(userTimeValue - targetValue) <= 3;
  }) ? 1 : 0;
}
function getIndustryScore(userIndustry, targetIndustries) {
  if (!userIndustry) return 0.5;
  const userIndustryLower = userIndustry.toLowerCase();
  const targetIndustriesLower = targetIndustries.map((i) => i.toLowerCase());
  return targetIndustriesLower.some(
    (target) => userIndustryLower.includes(target) || target.includes(userIndustryLower)
  ) ? 1 : 0;
}
function getGoalsScore(userGoals, targetKeywords) {
  if (!userGoals) return 0.5;
  const userGoalsLower = userGoals.toLowerCase();
  const matchingKeywords = targetKeywords.filter(
    (keyword) => userGoalsLower.includes(keyword.toLowerCase())
  );
  return matchingKeywords.length / targetKeywords.length;
}
function generatePackageRecommendation(profile) {
  const scores = PACKAGES.map((pkg) => ({
    package: pkg,
    score: pkg.suitabilityScore(profile)
  }));
  scores.sort((a, b) => b.score - a.score);
  const bestMatch = scores[0];
  const factors = [
    {
      factor: "Budget Alignment",
      weight: 30,
      value: profile.preferredBudget || "Not specified",
      impact: getBudgetScore(profile.preferredBudget, bestMatch.package.targetBudget.min, bestMatch.package.targetBudget.max) * 30
    },
    {
      factor: "Company Size",
      weight: 25,
      value: profile.companySize || "Not specified",
      impact: getCompanySizeScore(profile.companySize, bestMatch.package.targetCompanySize) * 25
    },
    {
      factor: "Project Timeline",
      weight: 20,
      value: profile.projectTimeline || "Not specified",
      impact: getTimelineScore(profile.projectTimeline, bestMatch.package.targetTimeline) * 20
    },
    {
      factor: "Industry Match",
      weight: 15,
      value: profile.industry || "Not specified",
      impact: getIndustryScore(profile.industry, bestMatch.package.targetIndustries) * 15
    },
    {
      factor: "Business Goals",
      weight: 10,
      value: profile.businessGoals || "Not specified",
      impact: getGoalsScore(profile.businessGoals, ["growth", "automation", "efficiency"]) * 10
    }
  ];
  const reason = generatePersonalizedReason(profile, bestMatch.package, factors);
  return {
    packageType: bestMatch.package.id,
    score: Math.round(bestMatch.score),
    reason,
    factors
  };
}
function generatePersonalizedReason(profile, selectedPackage, factors) {
  const highImpactFactors = factors.filter((f) => f.impact > 15).map((f) => f.factor);
  const userName = profile.firstName || "there";
  const companyName = profile.company || "your business";
  let reason = `Hi ${userName}! Based on your profile, the ${selectedPackage.name} is perfect for ${companyName}. `;
  if (highImpactFactors.includes("Budget Alignment")) {
    reason += `Your budget preferences align well with this package's value proposition. `;
  }
  if (highImpactFactors.includes("Company Size")) {
    reason += `This solution is specifically designed for ${profile.companySize || "your"} size organizations. `;
  }
  if (highImpactFactors.includes("Project Timeline")) {
    reason += `The implementation timeline matches your ${profile.projectTimeline || "preferred"} timeframe. `;
  }
  if (profile.businessGoals) {
    reason += `The package features directly support your goals: ${profile.businessGoals}. `;
  }
  reason += `This recommendation considers all your requirements equally to ensure the best fit for your digital transformation journey.`;
  return reason;
}

// file-upload.ts
import multer from "multer";

// cloudinary-config.ts
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});
console.log("Cloudinary config status:", {
  cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
  api_key: !!process.env.CLOUDINARY_API_KEY,
  api_secret: !!process.env.CLOUDINARY_API_SECRET
});
async function uploadToCloudinary(fileBuffer, originalName, folder, resourceType = "auto") {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: resourceType
    };
    if (folder && folder.trim()) {
      uploadOptions.folder = folder;
    }
    console.log("Cloudinary upload options:", uploadOptions);
    const base64Data = `data:${resourceType === "raw" ? "application/octet-stream" : "image/jpeg"};base64,${fileBuffer.toString("base64")}`;
    cloudinary.uploader.upload(
      base64Data,
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            original_filename: originalName,
            format: result.format,
            resource_type: result.resource_type,
            bytes: result.bytes
          });
        } else {
          reject(new Error("Upload failed"));
        }
      }
    ).end(fileBuffer);
  });
}
async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
}
function getOptimizedUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width,
        height: options.height,
        crop: "fill",
        quality: options.quality || "auto",
        fetch_format: options.format || "auto"
      }
    ]
  });
}

// file-upload.ts
var storage2 = multer.memoryStorage();
var upload = multer({
  storage: storage2,
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/svg+xml",
      // Videos
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/webm",
      "video/mkv",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "text/csv",
      "application/rtf",
      // Archives
      "application/zip",
      "application/x-rar-compressed",
      "application/x-tar",
      "application/gzip",
      // Audio
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp3",
      "audio/mp4"
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});
async function uploadFiles(files, folder = "uploads") {
  const uploadPromises = files.map(async (file) => {
    let resourceType = "raw";
    if (file.mimetype.startsWith("image/")) {
      resourceType = "image";
    } else if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
    } else if (file.mimetype.startsWith("audio/")) {
      resourceType = "raw";
    }
    const result = await uploadToCloudinary(
      file.buffer,
      file.originalname,
      folder,
      resourceType
    );
    return {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      cloudinary_url: result.secure_url,
      cloudinary_public_id: result.public_id,
      upload_date: (/* @__PURE__ */ new Date()).toISOString()
    };
  });
  return Promise.all(uploadPromises);
}
async function deleteFiles(publicIds) {
  const deletePromises = publicIds.map(deleteFromCloudinary);
  await Promise.all(deletePromises);
}
function getFileCategory(mimetype) {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  if (mimetype.includes("pdf") || mimetype.includes("document") || mimetype.includes("sheet") || mimetype.includes("presentation") || mimetype.includes("text")) {
    return "document";
  }
  if (mimetype.includes("zip") || mimetype.includes("rar") || mimetype.includes("tar") || mimetype.includes("gzip")) {
    return "archive";
  }
  return "other";
}

// file-management-routes.ts
function setupFileManagementRoutes(app2) {
  app2.post("/api/files/upload", upload.array("files", 20), async (req, res) => {
    try {
      const files = req.files;
      const folder = req.body.folder || "uploads";
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files provided" });
      }
      const uploadedFiles = await uploadFiles(files, folder);
      res.json({
        success: true,
        files: uploadedFiles,
        message: `Successfully uploaded ${uploadedFiles.length} file(s)`
      });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload files",
        error: error?.message || "Unknown error"
      });
    }
  });
  app2.get("/api/files/optimize/:publicId", (req, res) => {
    try {
      const { publicId } = req.params;
      const { width, height, quality, format } = req.query;
      const optimizedUrl = getOptimizedUrl(publicId, {
        width: width ? parseInt(width) : void 0,
        height: height ? parseInt(height) : void 0,
        quality,
        format
      });
      res.json({ url: optimizedUrl });
    } catch (error) {
      console.error("URL optimization error:", error);
      res.status(500).json({ message: "Failed to generate optimized URL" });
    }
  });
  app2.delete("/api/files/delete", async (req, res) => {
    try {
      const { publicIds } = req.body;
      if (!publicIds || !Array.isArray(publicIds)) {
        return res.status(400).json({ message: "Invalid public IDs provided" });
      }
      await deleteFiles(publicIds);
      res.json({
        success: true,
        message: `Successfully deleted ${publicIds.length} file(s)`
      });
    } catch (error) {
      console.error("File deletion error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete files",
        error: error?.message || "Unknown error"
      });
    }
  });
  app2.get("/api/admin/quotes/:quoteId/files", async (req, res) => {
    try {
      const { quoteId } = req.params;
      const quote = await storage.getQuote(parseInt(quoteId));
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      const files = quote.attachments.map((attachment) => ({
        ...attachment,
        category: getFileCategory(attachment.mimetype),
        optimized_url: getOptimizedUrl(attachment.cloudinary_public_id, { quality: "auto" })
      }));
      res.json({ files });
    } catch (error) {
      console.error("Get quote files error:", error);
      res.status(500).json({ message: "Failed to fetch quote files" });
    }
  });
  app2.get("/api/admin/files/dashboard", async (req, res) => {
    try {
      const quotes2 = await storage.getQuotes();
      if (!quotes2 || quotes2.length === 0) {
        return res.json({
          summary: {
            totalFiles: 0,
            totalSize: 0,
            totalSizeFormatted: "0.00 MB",
            filesByType: {
              image: 0,
              video: 0,
              document: 0,
              audio: 0,
              archive: 0,
              other: 0
            }
          },
          files: []
        });
      }
      const quotesWithFiles = quotes2.filter((quote) => quote.attachments && Array.isArray(quote.attachments) && quote.attachments.length > 0);
      let totalFiles = 0;
      let totalSize = 0;
      const filesByType = {
        image: 0,
        video: 0,
        document: 0,
        audio: 0,
        archive: 0,
        other: 0
      };
      const allFiles = [];
      quotesWithFiles.forEach((quote) => {
        if (quote.attachments && Array.isArray(quote.attachments)) {
          quote.attachments.forEach((file) => {
            totalFiles++;
            totalSize += file.size || 0;
            const category = getFileCategory(file.mimetype || "application/octet-stream");
            filesByType[category] = (filesByType[category] || 0) + 1;
            allFiles.push({
              ...file,
              quoteId: quote.id,
              quoteEmail: quote.email,
              category,
              optimized_url: file.cloudinary_public_id ? getOptimizedUrl(file.cloudinary_public_id, { quality: "auto" }) : null
            });
          });
        }
      });
      res.json({
        summary: {
          totalFiles,
          totalSize,
          totalSizeFormatted: `${(totalSize / (1024 * 1024)).toFixed(2)} MB`,
          filesByType
        },
        files: allFiles.sort((a, b) => {
          const aDate = new Date(a.upload_date || 0).getTime();
          const bDate = new Date(b.upload_date || 0).getTime();
          return bDate - aDate;
        })
      });
    } catch (error) {
      console.error("Admin file dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch file dashboard data", error: error?.message || "Unknown error" });
    }
  });
}

// audio-upload-routes.ts
import express from "express";
import multer2 from "multer";
var router = express.Router();
var audioUpload = multer2({
  storage: multer2.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024
    // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp3",
      "audio/mp4",
      "audio/m4a",
      "audio/webm",
      "audio/x-wav",
      "audio/aac",
      "video/webm"
      // webm can contain audio
    ];
    if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith(".webm")) {
      cb(null, true);
    } else {
      cb(new Error(`Audio file type ${file.mimetype} not allowed`));
    }
  }
});
router.post("/upload-audio", audioUpload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }
    const { originalname, buffer, mimetype, size } = req.file;
    const { recordingName, quoteId } = req.body;
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const filename = recordingName || `voice-recording-${timestamp2}`;
    const folder = quoteId ? `quotes/${quoteId}/audio` : "audio-recordings";
    const cloudinaryResult = await uploadToCloudinary(
      buffer,
      `${filename}.${mimetype.split("/")[1] || "webm"}`,
      folder,
      "raw"
    );
    res.json({
      success: true,
      audio: {
        filename,
        originalName: originalname,
        mimetype,
        size,
        cloudinary_url: cloudinaryResult.secure_url,
        cloudinary_public_id: cloudinaryResult.public_id,
        upload_date: (/* @__PURE__ */ new Date()).toISOString(),
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes
      }
    });
  } catch (error) {
    console.error("Audio upload error:", error);
    res.status(500).json({
      error: "Failed to upload audio recording",
      message: error?.message || "Unknown error occurred"
    });
  }
});
router.post("/upload-recording-blob", async (req, res) => {
  try {
    const { audioBlob, recordingName, quoteId } = req.body;
    if (!audioBlob) {
      return res.status(400).json({ error: "No audio blob provided" });
    }
    const base64Data = audioBlob.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const filename = recordingName || `voice-recording-${timestamp2}`;
    try {
      const cloudinaryResult = await uploadToCloudinary(
        buffer,
        filename,
        "audio-recordings",
        // Use folder again
        "raw"
      );
      res.json({
        success: true,
        audio: {
          filename,
          mimetype: "audio/webm",
          size: buffer.length,
          cloudinary_url: cloudinaryResult.secure_url,
          cloudinary_public_id: cloudinaryResult.public_id,
          upload_date: (/* @__PURE__ */ new Date()).toISOString(),
          format: cloudinaryResult.format,
          bytes: cloudinaryResult.bytes,
          storage: "cloudinary"
        }
      });
    } catch (cloudinaryError) {
      console.warn("Cloudinary upload failed, providing local fallback:", cloudinaryError.message);
      res.json({
        success: true,
        audio: {
          filename,
          mimetype: "audio/webm",
          size: buffer.length,
          local_blob: true,
          // Indicates this is stored locally in the browser
          upload_date: (/* @__PURE__ */ new Date()).toISOString(),
          storage: "local",
          note: "Audio stored locally - will be included when you submit your quote"
        }
      });
    }
  } catch (error) {
    console.error("Blob upload error:", error);
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const filename = req.body.recordingName || `voice-recording-${timestamp2}`;
    res.json({
      success: true,
      audio: {
        filename,
        mimetype: "audio/webm",
        size: req.body.audioBlob ? Buffer.from(req.body.audioBlob.split(",")[1], "base64").length : 0,
        local_blob: true,
        upload_date: (/* @__PURE__ */ new Date()).toISOString(),
        storage: "local",
        note: "Audio stored locally - will be included when you submit your quote"
      }
    });
  }
});
router.get("/audio/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
    const audioUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`;
    res.json({
      success: true,
      audio_url: audioUrl,
      public_id: publicId
    });
  } catch (error) {
    console.error("Audio retrieval error:", error);
    res.status(500).json({
      error: "Failed to retrieve audio file",
      message: error?.message || "Unknown error occurred"
    });
  }
});
var audio_upload_routes_default = router;

// email-service.ts
import { Resend } from "resend";
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable must be set");
}
var resend = new Resend(process.env.RESEND_API_KEY);
async function sendEmail(params) {
  try {
    const { data, error } = await resend.emails.send({
      from: "2Pbal <onboarding@resend.dev>",
      to: params.to,
      subject: params.subject,
      html: params.html
    });
    if (error) {
      console.error("Resend email error:", error);
      return false;
    }
    console.log("Email sent successfully:", data?.id);
    return true;
  } catch (error) {
    console.error("Email service error:", error);
    return false;
  }
}
function generateVerificationEmailHTML(userFirstName, verificationLink) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - 2Pbal</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #2563eb, #06b6d4);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 18px;
                color: #2563eb;
                margin-bottom: 20px;
            }
            .message {
                font-size: 16px;
                margin-bottom: 30px;
                line-height: 1.7;
            }
            .verify-button {
                display: inline-block;
                background: linear-gradient(135deg, #84cc16, #06b6d4);
                color: white;
                padding: 16px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                transition: transform 0.2s;
            }
            .verify-button:hover {
                transform: translateY(-2px);
            }
            .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .footer a {
                color: #2563eb;
                text-decoration: none;
            }
            .security-note {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 30px 0;
                border-radius: 4px;
            }
            .security-note strong {
                color: #92400e;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>2Pbal</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Precise Programming for Business Advancement</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello ${userFirstName || "there"}!
                </div>
                
                <div class="message">
                    Welcome to 2Pbal! We're excited to have you join our community of businesses achieving enterprise results without enterprise costs.
                </div>
                
                <div class="message">
                    To complete your account setup and start accessing our services, please verify your email address by clicking the button below:
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${verificationLink}" class="verify-button">
                        Verify Email Address
                    </a>
                </div>
                
                <div class="security-note">
                    <strong>Security Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with 2Pbal, please ignore this email.
                </div>
                
                <div class="message">
                    Once verified, you'll be able to:
                    <ul style="margin: 15px 0; padding-left: 20px;">
                        <li>Browse and purchase our service packages</li>
                        <li>Request custom quotes for your business needs</li>
                        <li>Access your client portal and project management tools</li>
                        <li>Calculate potential savings with our interactive calculator</li>
                    </ul>
                </div>
                
                <div class="message">
                    If the button above doesn't work, you can copy and paste this link into your browser:
                    <br>
                    <a href="${verificationLink}" style="color: #2563eb; word-break: break-all;">${verificationLink}</a>
                </div>
            </div>
            
            <div class="footer">
                <p>Need help? Contact us at <a href="mailto:support@2pbal.com">support@2pbal.com</a></p>
                <p>&copy; 2024 2Pbal. All rights reserved.</p>
                <p style="margin-top: 20px; font-size: 12px; color: #999;">
                    This email was sent to you. If you didn't sign up for 2Pbal, you can safely ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
}

// routes.ts
import { fromZodError } from "zod-validation-error";
import multer3 from "multer";
import cookieParser from "cookie-parser";
import { z as z2 } from "zod";
var stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-07-30.basil"
  });
} else if (process.env.NODE_ENV !== "development") {
  throw new Error("Missing required Stripe secret: STRIPE_SECRET_KEY");
}
var upload2 = multer3({
  storage: multer3.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    // 10MB limit per file
    files: 10
    // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "application/zip"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});
async function requireAuth(req, res, next) {
  try {
    const sessionId = req.cookies?.session;
    if (!sessionId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    const session = await storage.getSession(sessionId);
    if (!session) {
      res.clearCookie("session");
      return res.status(401).json({ message: "Invalid or expired session" });
    }
    const user = await storage.getUser(session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    req.session = session;
    await storage.logActivity({
      userId: user.id,
      action: `${req.method} ${req.path}`,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent")
    });
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
}
async function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
async function requireEmailVerification(req, res, next) {
  if (!req.user?.emailVerified) {
    return res.status(403).json({
      message: "Email verification required. Please check your email and verify your account before making purchases.",
      requiresVerification: true
    });
  }
  next();
}
async function registerRoutes(app2) {
  app2.use("/api/audio", audio_upload_routes_default);
  app2.use(cookieParser());
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const result = signupSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      const existingUser = await storage.getUserByEmail(result.data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      const user = await storage.createUser(result.data);
      const verificationToken = await storage.createEmailVerificationToken(user.id, user.email);
      const verificationLink = `${req.protocol}://${req.get("host")}/verify-email?token=${verificationToken.token}`;
      const emailHTML = generateVerificationEmailHTML(user.firstName || "there", verificationLink);
      const emailSent = await sendEmail({
        to: user.email,
        subject: "Verify Your Email - Welcome to 2Pbal!",
        html: emailHTML
      });
      if (!emailSent) {
        console.error("Failed to send verification email to:", user.email);
      }
      const session = await storage.createSession(user.id);
      res.cookie("session", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1e3,
        // 7 days
        sameSite: "lax"
      });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({
        user: userWithoutPassword,
        message: emailSent ? "Account created! Please check your email to verify your account." : "Account created! Please contact support if you need to verify your email."
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Failed to create account" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      const loginResult = await storage.loginUser(result.data);
      if (!loginResult) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const { user, session } = loginResult;
      res.cookie("session", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1e3,
        // 7 days
        sameSite: "lax"
      });
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  app2.post("/api/auth/logout", async (req, res) => {
    try {
      const sessionId = req.cookies?.session;
      if (sessionId) {
        await storage.deleteSession(sessionId);
      }
      res.clearCookie("session");
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Failed to logout" });
    }
  });
  app2.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const { password: _, ...userWithoutPassword } = req.user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
  app2.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Verification token is required" });
      }
      const verified = await storage.verifyEmailToken(token);
      if (!verified) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
      res.json({ message: "Email verified successfully! You can now make purchases." });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });
  app2.post("/api/auth/resend-verification", requireAuth, async (req, res) => {
    try {
      if (req.user.emailVerified) {
        return res.status(400).json({ message: "Email is already verified" });
      }
      const verificationToken = await storage.createEmailVerificationToken(req.user.id, req.user.email);
      const verificationLink = `${req.protocol}://${req.get("host")}/verify-email?token=${verificationToken.token}`;
      const emailHTML = generateVerificationEmailHTML(req.user.firstName || "there", verificationLink);
      const emailSent = await sendEmail({
        to: req.user.email,
        subject: "Verify Your Email - 2Pbal",
        html: emailHTML
      });
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send verification email" });
      }
      res.json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({ message: "Failed to resend verification email" });
    }
  });
  app2.get("/api/auth/check-email", async (req, res) => {
    try {
      const { email } = req.query;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      res.json({ exists: !!user });
    } catch (error) {
      console.error("Check email error:", error);
      res.status(500).json({ message: "Failed to check email" });
    }
  });
  app2.post("/api/auth/magic-link", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email is required" });
      }
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ message: "If an account exists with this email, a magic link has been sent" });
      }
      const magicToken = await storage.createEmailVerificationToken(user.id, user.email);
      const magicLink = `${req.protocol}://${req.get("host")}/auth/magic-login?token=${magicToken.token}`;
      const magicLinkHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Magic Login Link - 2Pbal</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #14b8a6, #0891b2); padding: 30px; text-align: center; color: white; }
                .content { background: #f9fafb; padding: 30px; }
                .button { display: inline-block; background: linear-gradient(135deg, #14b8a6, #0891b2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
                .footer { text-align: center; color: #666; font-size: 12px; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>\u{1F680} Your Magic Login Link</h1>
                    <p>Secure access to your 2Pbal account</p>
                </div>
                <div class="content">
                    <p>Hi ${user.firstName || "there"}!</p>
                    <p>Click the button below to securely log in to your 2Pbal account. No password needed!</p>
                    <p style="text-align: center;">
                        <a href="${magicLink}" class="button">\u{1F510} Log In Securely</a>
                    </p>
                    <p><strong>Important:</strong> This link expires in 10 minutes for your security.</p>
                    <p>If you didn't request this login link, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>\xA9 2025 2Pbal - Precise Programming for Business Advancement</p>
                    <p>If you have questions, contact us at hello@2pbal.com</p>
                </div>
            </div>
        </body>
        </html>
      `;
      const emailSent = await sendEmail({
        to: user.email,
        subject: "\u{1F510} Your Magic Login Link - 2Pbal",
        html: magicLinkHTML
      });
      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send magic link" });
      }
      res.json({ message: "If an account exists with this email, a magic link has been sent" });
    } catch (error) {
      console.error("Magic link error:", error);
      res.status(500).json({ message: "Failed to send magic link" });
    }
  });
  app2.get("/api/auth/magic-login", async (req, res) => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Invalid magic link" });
      }
      const verificationToken = await storage.getEmailVerificationToken(token);
      if (!verificationToken) {
        return res.status(400).json({ message: "Invalid magic link" });
      }
      const user = await storage.getUser(verificationToken.userId);
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
      const verified = await storage.verifyEmailToken(token);
      if (!verified) {
        return res.status(400).json({ message: "Magic link expired or invalid" });
      }
      const session = await storage.createSession(user.id);
      res.cookie("session", session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1e3,
        // 7 days
        sameSite: "lax"
      });
      res.redirect("/dashboard");
    } catch (error) {
      console.error("Magic login error:", error);
      res.redirect("/login?error=magic-link-failed");
    }
  });
  app2.put("/api/users/profile", requireAuth, async (req, res) => {
    try {
      const result = profileUpdateSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      const recommendation = generatePackageRecommendation(result.data);
      const updatedUser = await storage.updateUserWithRecommendation(req.user.id, result.data, recommendation);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({
        user: userWithoutPassword,
        recommendation
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  app2.get("/api/users/recommendation", requireAuth, async (req, res) => {
    try {
      const user = req.user;
      if (!user.recommendedPackage) {
        return res.status(404).json({ message: "No recommendation available" });
      }
      res.json({
        packageType: user.recommendedPackage,
        score: user.recommendationScore,
        reason: user.recommendationReason,
        date: user.recommendationDate
      });
    } catch (error) {
      console.error("Get recommendation error:", error);
      res.status(500).json({ message: "Failed to get recommendation" });
    }
  });
  app2.post("/api/users/avatar", requireAuth, upload2.single("avatar"), async (req, res) => {
    try {
      let avatarData = "";
      if (req.file) {
        avatarData = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      } else if (req.body.avatar) {
        avatarData = req.body.avatar;
      } else {
        return res.status(400).json({ message: "No avatar data provided" });
      }
      const updatedUser = await storage.updateAvatar(req.user.id, avatarData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Avatar update error:", error);
      res.status(500).json({ message: "Failed to update avatar" });
    }
  });
  app2.put("/api/users/preferences", requireAuth, async (req, res) => {
    try {
      const result = preferencesUpdateSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      const updatedUser = await storage.updatePreferences(req.user.id, result.data);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Preferences update error:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });
  app2.delete("/api/users/account", requireAuth, async (req, res) => {
    try {
      const result = accountDeletionSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      const deleted = await storage.deleteUser(req.user.id, result.data.password);
      if (!deleted) {
        return res.status(400).json({ message: "Invalid password or user not found" });
      }
      res.clearCookie("session");
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Account deletion error:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });
  app2.get("/api/users/subscription", requireAuth, async (req, res) => {
    try {
      const subscription = req.user.subscription || {
        plan: "free",
        status: "active",
        startDate: req.user.createdAt,
        features: ["basic_support", "1_project"]
      };
      res.json({ subscription });
    } catch (error) {
      console.error("Get subscription error:", error);
      res.status(500).json({ message: "Failed to get subscription details" });
    }
  });
  app2.post("/api/users/change-password", requireAuth, async (req, res) => {
    try {
      const result = changePasswordSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      const changed = await storage.changePassword(
        req.user.id,
        result.data.currentPassword,
        result.data.newPassword
      );
      if (!changed) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });
  app2.post("/api/users/verify-email", async (req, res) => {
    try {
      const result = emailVerificationSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      const verified = await storage.verifyEmail(result.data.token);
      if (!verified) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });
  app2.get("/api/admin/users", requireAuth, requireAdmin, async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      const usersWithoutPasswords = users2.map(({ password: _, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.get("/api/admin/activity-logs", requireAuth, requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const userId = req.query.userId ? parseInt(req.query.userId) : void 0;
      const logs = await storage.getActivityLogs(userId, limit);
      res.json({ logs });
    } catch (error) {
      console.error("Get activity logs error:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });
  app2.put("/api/admin/users/:userId/role", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { role } = req.body;
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      const updatedUser = await storage.updateUserRole(userId, role);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.logActivity({
        adminId: req.user.id,
        action: `Updated user role to ${role}`,
        target: "user",
        targetId: userId,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent")
      });
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Update user role error:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });
  app2.put("/api/admin/users/:userId/status", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ message: "Invalid status value" });
      }
      const updatedUser = await storage.updateUser(userId, { isActive });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await storage.logActivity({
        adminId: req.user.id,
        action: isActive ? "Unblocked user" : "Blocked user",
        target: "user",
        targetId: userId,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent")
      });
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Update user status error:", error);
      res.status(500).json({ message: "Failed to update user status" });
    }
  });
  app2.delete("/api/admin/users/:userId", requireAuth, requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (userId === req.user.id) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const deleted = await storage.deleteUser(userId, "admin-force-delete");
      if (!deleted) {
        await storage.forceDeleteUser(userId);
      }
      await storage.logActivity({
        adminId: req.user.id,
        action: `Deleted user account`,
        target: "user",
        targetId: userId,
        details: { deletedUserEmail: user.email },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent")
      });
      res.json({ message: "User account deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ message: "Failed to delete user account" });
    }
  });
  app2.get("/api/quotes", async (req, res) => {
    try {
      const sessionId = req.cookies?.session;
      let userId = void 0;
      if (sessionId) {
        const session = await storage.getSession(sessionId);
        if (session) {
          userId = session.userId;
        }
      }
      const quotes2 = await storage.getQuotes(userId);
      res.json({ quotes: quotes2 });
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });
  app2.post("/api/quotes", upload2.any(), async (req, res) => {
    try {
      const formData = { ...req.body };
      if (formData.goals && typeof formData.goals === "string") {
        formData.goals = JSON.parse(formData.goals);
      }
      if (formData.overspending && typeof formData.overspending === "string") {
        formData.overspending = JSON.parse(formData.overspending);
      }
      if (formData.outcomes && typeof formData.outcomes === "string") {
        formData.outcomes = JSON.parse(formData.outcomes);
      }
      const sessionId = req.cookies?.session;
      if (sessionId) {
        const session = await storage.getSession(sessionId);
        if (session) {
          formData.userId = session.userId;
        }
      }
      const files = req.files;
      let attachments = [];
      if (files && files.length > 0) {
        try {
          attachments = await uploadFiles(files, "quotes");
          console.log(`Uploaded ${attachments.length} files to Cloudinary for quote`);
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          return res.status(500).json({
            success: false,
            error: "Failed to upload files to cloud storage",
            details: uploadError.message
          });
        }
      }
      const quoteData = insertQuoteSchema.parse({
        ...formData,
        attachments
      });
      const quote = await storage.createQuote(quoteData);
      res.json({
        success: true,
        quote,
        message: `Quote submitted successfully${files?.length ? ` with ${files.length} attachment(s)` : ""}`
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({
          success: false,
          error: "Invalid quote data",
          details: error.errors
        });
      } else if (error instanceof multer3.MulterError) {
        res.status(400).json({
          success: false,
          error: error.message === "File too large" ? "File size exceeds 10MB limit" : "File upload error",
          details: error.message
        });
      } else {
        console.error("Quote submission error:", error);
        res.status(500).json({
          success: false,
          error: "Failed to submit quote request"
        });
      }
    }
  });
  app2.post("/api/packages/track-view", async (req, res) => {
    try {
      const { packageName, packageType, viewDuration, pageUrl } = req.body;
      let userId = null;
      let sessionId = null;
      const sessionCookie = req.cookies?.session;
      if (sessionCookie) {
        const session = await storage.getSession(sessionCookie);
        if (session) {
          userId = session.userId;
        }
      }
      if (!userId) {
        sessionId = req.cookies?.session || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      const trackingData = {
        userId,
        sessionId,
        packageName,
        packageType,
        viewDuration: viewDuration || 0,
        pageUrl,
        userAgent: req.get("User-Agent"),
        viewCount: 1
      };
      await storage.trackPackageView(trackingData);
      res.json({ success: true, message: "Package view tracked" });
    } catch (error) {
      console.error("Package tracking error:", error);
      res.status(500).json({ message: "Failed to track package view" });
    }
  });
  app2.get("/api/packages/recommendations", requireAuth, async (req, res) => {
    try {
      const mostViewedPackage = await storage.getMostViewedPackageForUser(req.user.id);
      if (!mostViewedPackage) {
        return res.json({ message: "No package views found" });
      }
      res.json({
        recommendedPackage: {
          name: mostViewedPackage.packageName,
          type: mostViewedPackage.packageType,
          viewCount: mostViewedPackage.viewCount,
          totalViewTime: mostViewedPackage.viewDuration,
          lastViewed: mostViewedPackage.updatedAt
        }
      });
    } catch (error) {
      console.error("Package recommendations error:", error);
      res.status(500).json({ message: "Failed to get package recommendations" });
    }
  });
  app2.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const projects = await storage.getUserProjects(req.user.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  app2.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const result = insertProjectSchema.safeParse({
        ...req.body,
        userId: req.user.id
      });
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      const project = await storage.createProject(result.data);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  app2.post("/api/create-payment-intent", requireAuth, requireEmailVerification, async (req, res) => {
    try {
      const result = createPaymentIntentSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }
      const { amount, currency = "usd", serviceId, planId, description, metadata } = result.data;
      let customerId = void 0;
      const sessionId = req.cookies?.session;
      if (sessionId) {
        const session = await storage.getSession(sessionId);
        if (session) {
          const user = await storage.getUser(session.userId);
          if (user?.email) {
            const customers = await stripe.customers.list({ email: user.email, limit: 1 });
            if (customers.data.length > 0) {
              customerId = customers.data[0].id;
            } else {
              const customer = await stripe.customers.create({
                email: user.email,
                name: `${user.firstName} ${user.lastName}`.trim(),
                metadata: { userId: session.userId.toString() }
              });
              customerId = customer.id;
            }
          }
        }
      }
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        // Convert to cents
        currency,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true
          // Enables Apple Pay, Google Pay, etc.
        },
        payment_method_options: {
          card: {
            request_three_d_secure: "automatic"
          }
        },
        description: description || `Payment for ${serviceId ? `service ${serviceId}` : "services"}`,
        metadata: {
          serviceId: serviceId || "",
          planId: planId || "",
          userId: sessionId ? "authenticated" : "guest",
          ...metadata
        }
      });
      if (sessionId) {
        const session = await storage.getSession(sessionId);
        if (session) {
          await storage.createPayment({
            userId: session.userId,
            stripePaymentIntentId: paymentIntent.id,
            stripeCustomerId: customerId,
            amount: Math.round(amount * 100),
            currency,
            status: "pending",
            description: paymentIntent.description,
            metadata: paymentIntent.metadata
          });
        }
      }
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({
        message: "Error creating payment intent: " + error.message
      });
    }
  });
  app2.post("/api/create-subscription", requireAuth, requireEmailVerification, async (req, res) => {
    try {
      const result = createSubscriptionSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }
      const { priceId, packageType } = result.data;
      const user = req.user;
      let customer;
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          metadata: { userId: user.id.toString() }
        });
      }
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"]
      });
      await storage.createSubscription({
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer.id,
        stripePriceId: priceId,
        packageType,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1e3),
        currentPeriodEnd: new Date(subscription.current_period_end * 1e3),
        amount: subscription.items.data[0].price.unit_amount || 0,
        currency: subscription.items.data[0].price.currency,
        interval: subscription.items.data[0].price.recurring?.interval || "month",
        intervalCount: subscription.items.data[0].price.recurring?.interval_count || 1
      });
      const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;
      res.json({
        subscriptionId: subscription.id,
        clientSecret,
        status: subscription.status
      });
    } catch (error) {
      console.error("Subscription creation error:", error);
      res.status(500).json({
        message: "Error creating subscription: " + error.message
      });
    }
  });
  app2.post("/api/payment-webhook", async (req, res) => {
    try {
      const sig = req.headers["stripe-signature"];
      let event;
      try {
        event = stripe?.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
      } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
      if (!event) {
        return res.status(400).json({ message: "Invalid event" });
      }
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          const payment = await storage.getPaymentByStripeId(paymentIntent.id);
          if (payment) {
            await storage.updatePayment(payment.id, {
              status: "succeeded",
              paymentMethod: paymentIntent.payment_method_types?.[0],
              receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
            });
          }
          break;
        case "payment_intent.payment_failed":
          const failedPayment = event.data.object;
          const failedPaymentRecord = await storage.getPaymentByStripeId(failedPayment.id);
          if (failedPaymentRecord) {
            await storage.updatePayment(failedPaymentRecord.id, { status: "failed" });
          }
          break;
        case "invoice.payment_succeeded":
          const invoice = event.data.object;
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });
  app2.get("/api/payments", requireAuth, async (req, res) => {
    try {
      const payments2 = await storage.getUserPayments(req.user.id);
      res.json({ payments: payments2 });
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });
  app2.get("/api/subscriptions", requireAuth, async (req, res) => {
    try {
      const subscriptions2 = await storage.getUserSubscriptions(req.user.id);
      res.json({ subscriptions: subscriptions2 });
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });
  app2.post("/api/subscriptions/create", requireAuth, async (req, res) => {
    try {
      const result = createSubscriptionSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }
      const { priceId, packageType } = result.data;
      const user = req.user;
      let customer;
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          metadata: { userId: user.id.toString() }
        });
      }
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"]
      });
      await storage.createSubscription({
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer.id,
        stripePriceId: priceId,
        packageType,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1e3),
        currentPeriodEnd: new Date(subscription.current_period_end * 1e3),
        amount: subscription.items.data[0].price.unit_amount || 0,
        currency: subscription.items.data[0].price.currency,
        interval: subscription.items.data[0].price.recurring?.interval || "month",
        intervalCount: subscription.items.data[0].price.recurring?.interval_count || 1
      });
      const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;
      res.json({
        subscriptionId: subscription.id,
        clientSecret,
        status: subscription.status
      });
    } catch (error) {
      console.error("Subscription creation error:", error);
      res.status(500).json({
        message: "Error creating subscription: " + error.message
      });
    }
  });
  app2.put("/api/subscriptions/update", requireAuth, async (req, res) => {
    try {
      const { subscriptionId, newPriceId } = req.body;
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }
      const subscription = await storage.getSubscriptionByStripeId(subscriptionId);
      if (!subscription || subscription.userId !== req.user.id) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newPriceId
        }],
        proration_behavior: "create_prorations"
      });
      await storage.updateSubscription(subscription.id, {
        stripePriceId: newPriceId,
        amount: updatedSubscription.items.data[0].price.unit_amount || 0,
        interval: updatedSubscription.items.data[0].price.recurring?.interval || "month",
        intervalCount: updatedSubscription.items.data[0].price.recurring?.interval_count || 1
      });
      res.json({
        message: "Subscription updated successfully",
        subscription: updatedSubscription
      });
    } catch (error) {
      console.error("Subscription update error:", error);
      res.status(500).json({
        message: "Error updating subscription: " + error.message
      });
    }
  });
  app2.post("/api/subscriptions/cancel", requireAuth, async (req, res) => {
    try {
      const result = cancelSubscriptionSchema.safeParse(req.body);
      if (!result.success) {
        const errorMessage = fromZodError(result.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }
      const { subscriptionId, cancelAtPeriodEnd } = result.data;
      const subscription = await storage.getSubscriptionByStripeId(subscriptionId);
      if (!subscription || subscription.userId !== req.user.id) {
        return res.status(404).json({ message: "Subscription not found" });
      }
      const stripeSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd
      });
      await storage.updateSubscription(subscription.id, {
        cancelAtPeriodEnd,
        canceledAt: cancelAtPeriodEnd ? null : /* @__PURE__ */ new Date()
      });
      res.json({
        message: cancelAtPeriodEnd ? "Subscription will be canceled at period end" : "Subscription canceled",
        subscription: stripeSubscription
      });
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(500).json({
        message: "Error canceling subscription: " + error.message
      });
    }
  });
  app2.get("/api/subscriptions/invoices", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }
      const subscriptions2 = await storage.getUserSubscriptions(req.user.id);
      let allInvoices = [];
      for (const subscription of subscriptions2) {
        if (subscription.stripeCustomerId) {
          const invoices2 = await stripe.invoices.list({
            customer: subscription.stripeCustomerId,
            limit: 100
          });
          allInvoices = allInvoices.concat(invoices2.data);
        }
      }
      allInvoices.sort((a, b) => b.created - a.created);
      res.json({ invoices: allInvoices });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });
  app2.post("/api/subscriptions/portal", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }
      const user = req.user;
      let customerId;
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim(),
          metadata: { userId: user.id.toString() }
        });
        customerId = customer.id;
      }
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.origin}/subscription-management`
      });
      res.json({ url: session.url });
    } catch (error) {
      console.error("Portal session creation error:", error);
      res.status(500).json({
        message: "Error creating portal session: " + error.message
      });
    }
  });
  app2.get("/api/admin/subscriptions", requireAuth, requireAdmin, async (req, res) => {
    try {
      const allSubscriptions = await storage.getAllSubscriptions();
      const enrichedSubscriptions = await Promise.all(
        allSubscriptions.map(async (subscription) => {
          const user = await storage.getUser(subscription.userId);
          return {
            ...subscription,
            customerName: user ? `${user.firstName} ${user.lastName}` : "Unknown",
            customerEmail: user ? user.email : "Unknown"
          };
        })
      );
      res.json({ subscriptions: enrichedSubscriptions });
    } catch (error) {
      console.error("Error fetching admin subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });
  app2.post("/api/admin/subscriptions/create", requireAuth, requireAdmin, async (req, res) => {
    try {
      const { customerEmail, priceId, packageType } = req.body;
      if (!stripe) {
        return res.status(503).json({ message: "Stripe not configured" });
      }
      const user = await storage.getUserByEmail(customerEmail);
      if (!user) {
        return res.status(404).json({ message: "Customer not found" });
      }
      let customer;
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          name: `${user.firstName} ${user.lastName}`.trim(),
          metadata: { userId: user.id.toString() }
        });
      }
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        collection_method: "charge_automatically"
      });
      await storage.createSubscription({
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customer.id,
        stripePriceId: priceId,
        packageType,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1e3),
        currentPeriodEnd: new Date(subscription.current_period_end * 1e3),
        amount: subscription.items.data[0].price.unit_amount || 0,
        currency: subscription.items.data[0].price.currency,
        interval: subscription.items.data[0].price.recurring?.interval || "month",
        intervalCount: subscription.items.data[0].price.recurring?.interval_count || 1
      });
      await storage.logActivity({
        adminId: req.user.id,
        action: "Created subscription",
        target: "subscription",
        targetId: user.id,
        details: { customerEmail, packageType },
        ipAddress: req.ip,
        userAgent: req.get("User-Agent")
      });
      res.json({
        message: "Subscription created successfully",
        subscription
      });
    } catch (error) {
      console.error("Admin subscription creation error:", error);
      res.status(500).json({
        message: "Error creating subscription: " + error.message
      });
    }
  });
  setupFileManagementRoutes(app2);
  const httpServer = createServer(app2);
  return httpServer;
}

// vite.ts
import express2 from "express";
import fs from "fs";
import path from "path";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
function serveStatic(app2) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  serveStatic(app);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
