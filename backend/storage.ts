import { 
  type User, 
  type LoginData,
  type SignupData,
  type ProfileUpdate,
  type UserSession,
  type Quote, 
  type InsertQuote,
  type UserProject,
  type InsertProject,
  type ActivityLog,
  type EmailVerification,
  type PackageViewTracking,
  type InsertPackageViewTracking,
  users,
  userSessions,
  emailVerificationTokens,
  packageViewTracking,
  quotes,
  userProjects,
  activityLogs
} from '../shared/schema.js';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { db } from './db-config.js';
import { eq, desc, and } from 'drizzle-orm';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: SignupData): Promise<User>;
  updateUser(id: number, userData: ProfileUpdate): Promise<User | undefined>;
  updateUserWithRecommendation(id: number, userData: ProfileUpdate, recommendation: any): Promise<User | undefined>;
  loginUser(credentials: LoginData): Promise<{ user: User; session: UserSession } | null>;
  deleteUser(id: number, password: string): Promise<boolean>;
  forceDeleteUser(id: number): Promise<boolean>;
  changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean>;
  updateAvatar(id: number, avatar: string): Promise<User | undefined>;
  updatePreferences(id: number, preferences: any): Promise<User | undefined>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: number, role: string): Promise<User | undefined>;
  
  // Session operations
  createSession(userId: number): Promise<UserSession>;
  getSession(sessionId: string): Promise<UserSession | undefined>;
  deleteSession(sessionId: string): Promise<void>;
  
  // Email verification operations
  createEmailVerificationToken(userId: number, email: string): Promise<any>;
  getEmailVerificationToken(token: string): Promise<any | undefined>;
  verifyEmailToken(token: string): Promise<boolean>;
  deleteEmailVerificationToken(token: string): Promise<void>;
  
  // Package tracking operations
  trackPackageView(data: InsertPackageViewTracking): Promise<PackageViewTracking>;
  getPackageViewsForUser(userId: number): Promise<PackageViewTracking[]>;
  getMostViewedPackageForUser(userId: number): Promise<PackageViewTracking | undefined>;
  updateLastReminderSent(userId: number, packageType: string): Promise<void>;
  
  // Quote operations
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuotes(userId?: number): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  
  // Project operations
  createProject(project: InsertProject): Promise<UserProject>;
  getUserProjects(userId: number): Promise<UserProject[]>;
  getProject(id: number): Promise<UserProject | undefined>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<UserProject | undefined>;
  
  // Activity logging
  logActivity(activity: {
    userId?: number;
    adminId?: number;
    action: string;
    target?: string;
    targetId?: number;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ActivityLog>;
  getActivityLogs(userId?: number, limit?: number): Promise<ActivityLog[]>;
  
  // Payment operations
  createPayment(payment: any): Promise<any>;
  getPayment(id: number): Promise<any | undefined>;
  getPaymentByStripeId(stripePaymentIntentId: string): Promise<any | undefined>;
  getUserPayments(userId: number): Promise<any[]>;
  updatePayment(id: number, data: Partial<any>): Promise<any | undefined>;
  
  // Subscription operations
  createSubscription(subscription: any): Promise<any>;
  getSubscription(id: number): Promise<any | undefined>;
  getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<any | undefined>;
  getUserSubscriptions(userId: number): Promise<any[]>;
  getAllSubscriptions(): Promise<any[]>;
  updateSubscription(id: number, data: Partial<any>): Promise<any | undefined>;
  
  // Invoice operations
  createInvoice(invoice: any): Promise<any>;
  getInvoice(id: number): Promise<any | undefined>;
  getInvoiceByStripeId(stripeInvoiceId: string): Promise<any | undefined>;
  getUserInvoices(userId: number): Promise<any[]>;
  updateInvoice(id: number, data: Partial<any>): Promise<any | undefined>;
  
  // Email verification
  createEmailVerification(userId: number): Promise<EmailVerification>;
  verifyEmail(token: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private sessions: Map<string, UserSession> = new Map();
  private quotes: Map<number, Quote> = new Map();
  private projects: Map<number, UserProject> = new Map();
  private activityLogs: Map<number, ActivityLog> = new Map();
  private emailVerifications: Map<string, EmailVerification> = new Map();
  private emailVerificationTokens: Map<string, any> = new Map(); // Changed to any for type flexibility
  private packageViewTracking: Map<number, PackageViewTracking> = new Map();
  private payments: Map<number, any> = new Map(); // Changed to any for type flexibility
  private subscriptions: Map<number, any> = new Map(); // Changed to any for type flexibility
  private invoices: Map<number, any> = new Map(); // Changed to any for type flexibility
  private nextUserId = 1;
  private nextQuoteId = 1;
  private nextProjectId = 1;
  private nextActivityId = 1;
  private nextEmailVerificationTokenId = 1;
  private nextPaymentId: number = 1;
  private nextSubscriptionId: number = 1;
  private nextInvoiceId: number = 1;
  
  constructor() {
    // Create default admin user
    this.createAdminUser();
  }
  
  private async createAdminUser() {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser: User = {
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
      preferences: { theme: 'light', notifications: true, language: 'en', timezone: 'UTC' },
      subscription: null,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
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
      
      // Fill in optional fields with defaults for the type
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
          preferences: { theme: 'light', notifications: true, language: 'en', timezone: 'UTC' },
          subscription: null,
          lastLogin: null
        };
      }
      return undefined;
    } catch (error) {
      console.error('getUserByEmail error:', error);
      return undefined;
    }
  }

  async createUser(userData: SignupData): Promise<User> {
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
      role: 'user'
    }).returning();

    return result[0];
  }

  async updateUser(id: number, userData: ProfileUpdate): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date(),
      profileComplete: true,
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserWithRecommendation(id: number, userData: ProfileUpdate, recommendation: any): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = { 
      ...user, 
      ...userData, 
      profileComplete: true,
      recommendedPackage: recommendation.packageType,
      recommendationScore: recommendation.score,
      recommendationReason: recommendation.reason,
      recommendationDate: new Date(),
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async loginUser(credentials: LoginData): Promise<{ user: User; session: UserSession } | null> {
    const user = await this.getUserByEmail(credentials.email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) return null;

    // Update last login
    const updatedUser = { ...user, lastLogin: new Date() };
    this.users.set(user.id, updatedUser);

    const session = await this.createSession(user.id);
    return { user: updatedUser, session };
  }

  async createSession(userId: number): Promise<UserSession> {
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const result = await db.insert(userSessions).values({
      id: sessionId,
      userId,
      expiresAt,
      createdAt: new Date(),
    }).returning();

    return result[0];
  }

  async getSession(sessionId: string): Promise<UserSession | undefined> {
    try {
      const result = await db.select().from(userSessions)
        .where(eq(userSessions.id, sessionId))
        .limit(1);
      
      const session = result[0];
      if (!session || session.expiresAt < new Date()) {
        if (session) {
          await this.deleteSession(sessionId);
        }
        return undefined;
      }
      return session;
    } catch (error) {
      console.error('getSession error:', error);
      return undefined;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await db.delete(userSessions).where(eq(userSessions.id, sessionId));
    } catch (error) {
      console.error('deleteSession error:', error);
    }
  }

  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const quote: Quote = {
      id: this.nextQuoteId++,
      userId: quoteData.userId || null,
      // Remove name field as it doesn't exist in schema
      email: quoteData.email,
      company: quoteData.company || null,
      phone: quoteData.phone || null,
      goals: Array.isArray(quoteData.goals) ? quoteData.goals as string[] : [],
      overspending: Array.isArray(quoteData.overspending) ? quoteData.overspending as string[] : [],
      outcomes: Array.isArray(quoteData.outcomes) ? quoteData.outcomes as string[] : [],
      projectDescription: quoteData.projectDescription,
      timeline: quoteData.timeline,
      attachments: Array.isArray(quoteData.attachments)
        ? quoteData.attachments.filter((att: any) => att && typeof att === 'object' && 'filename' in att).map((att: any) => ({
            filename: (att as any).filename || '',
            mimetype: (att as any).mimetype || '',
            size: (att as any).size || 0,
            cloudinary_url: (att as any).cloudinary_url || '',
            cloudinary_public_id: (att as any).cloudinary_public_id || '',
            upload_date: (att as any).upload_date || new Date().toISOString(),
          }))
        : [],
      status: quoteData.status || "pending",
      createdAt: new Date(),
    };
    
    this.quotes.set(quote.id, quote);
    return quote;
  }

  async getQuotes(userId?: number): Promise<Quote[]> {
    const allQuotes = Array.from(this.quotes.values());
    
    if (userId) {
      return allQuotes
        .filter(quote => quote.userId === userId)
        .sort((a, b) => 
          (b.createdAt ? b.createdAt.getTime() : 0) - (a.createdAt ? a.createdAt.getTime() : 0)
        );
    }
    
    return allQuotes.sort((a, b) => 
      (b.createdAt ? b.createdAt.getTime() : 0) - (a.createdAt ? a.createdAt.getTime() : 0)
    );
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async createProject(projectData: InsertProject): Promise<UserProject> {
    const project: UserProject = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.projects.set(project.id, project);
    return project;
  }

  async getUserProjects(userId: number): Promise<UserProject[]> {
    return Array.from(this.projects.values())
      .filter(project => project.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getProject(id: number): Promise<UserProject | undefined> {
    return this.projects.get(id);
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<UserProject | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject: UserProject = {
      ...project,
      ...data,
      updatedAt: new Date(),
    };
    
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  // Account management methods
  async deleteUser(id: number, password: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return false;

    this.users.delete(id);
    // Clean up related sessions
    const sessionsToDelete: string[] = [];
    for (const [sessionId, session] of Array.from(this.sessions.entries())) {
      if (session.userId === id) {
        sessionsToDelete.push(sessionId);
      }
    }
    sessionsToDelete.forEach(sessionId => this.sessions.delete(sessionId));
    return true;
  }

  async forceDeleteUser(id: number): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;

    this.users.delete(id);
    // Also clean up related data
    for (const [sessionId, session] of Array.from(this.sessions.entries())) {
      if (session.userId === id) {
        this.sessions.delete(sessionId);
      }
    }
    
    return true;
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) return false;

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = { ...user, password: hashedNewPassword, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return true;
  }

  async updateAvatar(id: number, avatar: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, avatar, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updatePreferences(id: number, preferences: any): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { 
      ...user, 
      preferences: { ...user.preferences, ...preferences }, 
      updatedAt: new Date() 
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Admin methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateUserRole(userId: number, role: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = { ...user, role, updatedAt: new Date() };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Activity logging
  async logActivity(activity: {
    userId?: number;
    adminId?: number;
    action: string;
    target?: string;
    targetId?: number;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ActivityLog> {
    const log: ActivityLog = {
      id: this.nextActivityId++,
      userId: activity.userId || null,
      adminId: activity.adminId || null,
      action: activity.action,
      target: activity.target || null,
      targetId: activity.targetId || null,
      details: activity.details || null,
      ipAddress: activity.ipAddress || null,
      userAgent: activity.userAgent || null,
      createdAt: new Date(),
    };
    
    this.activityLogs.set(log.id, log);
    return log;
  }

  async getActivityLogs(userId?: number, limit: number = 50): Promise<ActivityLog[]> {
    const logs = Array.from(this.activityLogs.values());
    
    let filteredLogs = logs;
    if (userId) {
      filteredLogs = logs.filter(log => log.userId === userId || log.adminId === userId);
    }
    
    return filteredLogs
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }

  // Email verification
  async createEmailVerification(userId: number): Promise<EmailVerification> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const verification: EmailVerification = {
      id: this.nextActivityId++,
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    };
    
    this.emailVerifications.set(token, verification);
    return verification;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const verification = this.emailVerifications.get(token);
    if (!verification || verification.expiresAt < new Date()) {
      return false;
    }

    const user = this.users.get(verification.userId);
    if (!user) return false;

    const updatedUser = { ...user, emailVerified: true, updatedAt: new Date() };
    this.users.set(user.id, updatedUser);
    
    this.emailVerifications.delete(token);
    return true;
  }

  // Email verification token operations
  async createEmailVerificationToken(userId: number, email: string): Promise<any> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const result = await db.insert(emailVerificationTokens).values({
      userId,
      token,
      email,
      expiresAt,
      createdAt: new Date(),
    }).returning();

    return result[0];
  }

  async getEmailVerificationToken(token: string): Promise<any | undefined> {
    const verification = this.emailVerificationTokens.get(token);
    if (!verification || verification.expiresAt < new Date()) {
      if (verification) {
        this.emailVerificationTokens.delete(token);
      }
      return undefined;
    }
    return verification;
  }

  async verifyEmailToken(token: string): Promise<boolean> {
    const verification = this.emailVerificationTokens.get(token);
    if (!verification || verification.expiresAt < new Date()) {
      return false;
    }

    const user = this.users.get(verification.userId);
    if (!user) return false;

    const updatedUser = { ...user, emailVerified: true, updatedAt: new Date() };
    this.users.set(user.id, updatedUser);
    
    this.emailVerificationTokens.delete(token);
    return true;
  }

  async deleteEmailVerificationToken(token: string): Promise<void> {
    this.emailVerificationTokens.delete(token);
  }

  // Package tracking operations
  async trackPackageView(data: InsertPackageViewTracking): Promise<PackageViewTracking> {
    const tracking: PackageViewTracking = {
      id: this.packageViewTracking.size + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: data.userId ?? null,
      sessionId: data.sessionId ?? null,
      packageName: data.packageName || '',
      packageType: data.packageType || '',
      viewDuration: data.viewDuration ?? null,
      pageUrl: data.pageUrl ?? null,
      userAgent: data.userAgent ?? null,
      lastReminderSent: data.lastReminderSent ?? null,
      viewCount: data.viewCount ?? 1,
    };
    
    this.packageViewTracking.set(tracking.id, tracking);
    return tracking;
  }

  async getPackageViewsForUser(userId: number): Promise<PackageViewTracking[]> {
    const userViews: PackageViewTracking[] = [];
    for (const tracking of this.packageViewTracking.values()) {
      if (tracking.userId === userId) {
        userViews.push(tracking);
      }
    }
    return userViews.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getMostViewedPackageForUser(userId: number): Promise<PackageViewTracking | undefined> {
    const userViews = await this.getPackageViewsForUser(userId);
    
    if (userViews.length === 0) return undefined;
    
    // Group by package type and sum view counts and durations
    const packageStats = new Map<string, { count: number; totalDuration: number; latest: PackageViewTracking }>();
    
    for (const view of userViews) {
      const existing = packageStats.get(view.packageType);
      if (existing) {
        existing.count += (view.viewCount || 1);
        existing.totalDuration += (view.viewDuration || 0);
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
    
    // Find package with highest engagement (combination of views and time spent)
    let bestPackage: PackageViewTracking | undefined;
    let bestScore = 0;
    
    for (const [, stats] of packageStats) {
      const score = stats.count * 10 + stats.totalDuration; // Weight views more than duration
      if (score > bestScore) {
        bestScore = score;
        bestPackage = stats.latest;
      }
    }
    
    return bestPackage;
  }

  async updateLastReminderSent(userId: number, packageType: string): Promise<void> {
    for (const [id, tracking] of this.packageViewTracking.entries()) {
      if (tracking.userId === userId && tracking.packageType === packageType) {
        const updated = { ...tracking, lastReminderSent: new Date(), updatedAt: new Date() };
        this.packageViewTracking.set(id, updated);
      }
    }
  }

  // Payment operations
  async createPayment(payment: any): Promise<any> {
    const newPayment = {
      id: this.nextPaymentId++,
      ...payment,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.payments.set(newPayment.id, newPayment);
    return newPayment;
  }

  async getPayment(id: number): Promise<any | undefined> {
    return this.payments.get(id);
  }

  async getPaymentByStripeId(stripePaymentIntentId: string): Promise<any | undefined> {
    for (const payment of this.payments.values()) {
      if (payment.stripePaymentIntentId === stripePaymentIntentId) {
        return payment;
      }
    }
    return undefined;
  }

  async getUserPayments(userId: number): Promise<any[]> {
    const userPayments: any[] = [];
    for (const payment of this.payments.values()) {
      if (payment.userId === userId) {
        userPayments.push(payment);
      }
    }
    return userPayments.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updatePayment(id: number, data: Partial<any>): Promise<any | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updated = { ...payment, ...data, updatedAt: new Date() };
    this.payments.set(id, updated);
    return updated;
  }

  // Subscription operations
  async createSubscription(subscription: any): Promise<any> {
    const newSubscription = {
      id: this.nextSubscriptionId++,
      ...subscription,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subscriptions.set(newSubscription.id, newSubscription);
    return newSubscription;
  }

  async getSubscription(id: number): Promise<any | undefined> {
    return this.subscriptions.get(id);
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<any | undefined> {
    for (const subscription of this.subscriptions.values()) {
      if (subscription.stripeSubscriptionId === stripeSubscriptionId) {
        return subscription;
      }
    }
    return undefined;
  }

  async getUserSubscriptions(userId: number): Promise<any[]> {
    const userSubscriptions: any[] = [];
    for (const subscription of this.subscriptions.values()) {
      if (subscription.userId === userId) {
        userSubscriptions.push(subscription);
      }
    }
    return userSubscriptions.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getAllSubscriptions(): Promise<any[]> {
    return Array.from(this.subscriptions.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateSubscription(id: number, data: Partial<any>): Promise<any | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updated = { ...subscription, ...data, updatedAt: new Date() };
    this.subscriptions.set(id, updated);
    return updated;
  }

  // Invoice operations
  async createInvoice(invoice: any): Promise<any> {
    const newInvoice = {
      id: this.nextInvoiceId++,
      ...invoice,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.invoices.set(newInvoice.id, newInvoice);
    return newInvoice;
  }

  async getInvoice(id: number): Promise<any | undefined> {
    return this.invoices.get(id);
  }

  async getInvoiceByStripeId(stripeInvoiceId: string): Promise<any | undefined> {
    for (const invoice of this.invoices.values()) {
      if (invoice.stripeInvoiceId === stripeInvoiceId) {
        return invoice;
      }
    }
    return undefined;
  }

  async getUserInvoices(userId: number): Promise<any[]> {
    const userInvoices: any[] = [];
    for (const invoice of this.invoices.values()) {
      if (invoice.userId === userId) {
        userInvoices.push(invoice);
      }
    }
    return userInvoices.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateInvoice(id: number, data: Partial<any>): Promise<any | undefined> {
    const invoice = this.invoices.get(id);
    if (!invoice) return undefined;
    
    const updated = { ...invoice, ...data, updatedAt: new Date() };
    this.invoices.set(id, updated);
    return updated;
  }

}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
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
      
      // Fill in optional fields with defaults for the type
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
          preferences: { theme: 'light', notifications: true, language: 'en', timezone: 'UTC' },
          subscription: null,
          lastLogin: null
        };
      }
      return undefined;
    } catch (error) {
      console.error('getUser error:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
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
      
      // Fill in optional fields with defaults for the type
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
          preferences: { theme: 'light', notifications: true, language: 'en', timezone: 'UTC' },
          subscription: null,
          lastLogin: null
        };
      }
      return undefined;
    } catch (error) {
      console.error('getUserByEmail error:', error);
      return undefined;
    }
  }

  async createUser(userData: SignupData): Promise<User> {
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
      role: 'user'
    }).returning();

    return result[0];
  }

  async updateUser(id: number, userData: ProfileUpdate): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }

  async updateUserWithRecommendation(id: number, userData: ProfileUpdate, recommendation: any): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ 
        ...userData, 
        profileComplete: true,
        recommendedPackage: recommendation.packageType,
        recommendationScore: recommendation.score,
        recommendationReason: recommendation.reason,
        recommendationDate: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async loginUser(credentials: LoginData): Promise<{ user: User; session: UserSession } | null> {
    const user = await this.getUserByEmail(credentials.email);
    if (!user || !user.isActive) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    const session = await this.createSession(user.id);
    return { user, session };
  }

  async deleteUser(id: number, password: string): Promise<boolean> {
    const user = await this.getUser(id);
    if (!user) return false;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return false;

    await db.delete(users).where(eq(users.id, id));
    return true;
  }

  async forceDeleteUser(id: number): Promise<boolean> {
    try {
      await db.delete(users).where(eq(users.id, id));
      return true;
    } catch (error) {
      console.error("Force delete user error:", error);
      return false;
    }
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.getUser(id);
    if (!user) return false;

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) return false;

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    await db.update(users)
      .set({ password: hashedNewPassword, updatedAt: new Date() })
      .where(eq(users.id, id));

    return true;
  }

  async updateAvatar(id: number, avatar: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ avatar, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }

  async updatePreferences(id: number, preferences: any): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ preferences, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
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
      }).from(users);
      
      return result.map(user => ({
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
        preferences: { theme: 'light', notifications: true, language: 'en', timezone: 'UTC' },
        subscription: null,
        lastLogin: null
      }));
    } catch (error) {
      console.error('getAllUsers error:', error);
      return [];
    }
  }

  async updateUserRole(userId: number, role: string): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0];
  }

  // Session operations
  async createSession(userId: number): Promise<UserSession> {
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const result = await db.insert(userSessions).values({
      id: sessionId,
      userId,
      expiresAt,
      createdAt: new Date(),
    }).returning();

    return result[0];
  }

  async getSession(sessionId: string): Promise<UserSession | undefined> {
    try {
      const result = await db.select().from(userSessions)
        .where(eq(userSessions.id, sessionId))
        .limit(1);
      
      const session = result[0];
      if (!session || session.expiresAt < new Date()) {
        if (session) {
          await this.deleteSession(sessionId);
        }
        return undefined;
      }
      return session;
    } catch (error) {
      console.error('getSession error:', error);
      return undefined;
    }
  }

  async deleteSession(sessionId: string): Promise<void> {
    try {
      await db.delete(userSessions).where(eq(userSessions.id, sessionId));
    } catch (error) {
      console.error('deleteSession error:', error);
    }
  }

  // Email verification operations
  async createEmailVerificationToken(userId: number, email: string): Promise<any> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const result = await db.insert(emailVerificationTokens).values({
      userId,
      token,
      email,
      expiresAt,
      createdAt: new Date(),
    }).returning();

    return result[0];
  }

  async getEmailVerificationToken(token: string): Promise<any | undefined> {
    try {
      const result = await db.select().from(emailVerificationTokens)
        .where(eq(emailVerificationTokens.token, token))
        .limit(1);
      
      const verification = result[0];
      if (!verification || verification.expiresAt < new Date()) {
        if (verification) {
          await this.deleteEmailVerificationToken(token);
        }
        return undefined;
      }
      return verification;
    } catch (error) {
      console.error('getEmailVerificationToken error:', error);
      return undefined;
    }
  }

  async verifyEmailToken(token: string): Promise<boolean> {
    const verification = await this.getEmailVerificationToken(token);
    if (!verification) return false;

    // Update user's email verification status
    const result = await db.update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, verification.userId))
      .returning();

    if (result.length > 0) {
      await this.deleteEmailVerificationToken(token);
      return true;
    }

    return false;
  }

  async deleteEmailVerificationToken(token: string): Promise<void> {
    await db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
  }

  // Package tracking operations
  async trackPackageView(data: InsertPackageViewTracking): Promise<PackageViewTracking> {
    const result = await db.insert(packageViewTracking).values(data).returning();
    return result[0];
  }

  async getPackageViewsForUser(userId: number): Promise<PackageViewTracking[]> {
    return await db.select().from(packageViewTracking)
      .where(eq(packageViewTracking.userId, userId))
      .orderBy(desc(packageViewTracking.createdAt));
  }

  async getMostViewedPackageForUser(userId: number): Promise<PackageViewTracking | undefined> {
    const userViews = await this.getPackageViewsForUser(userId);
    
    if (userViews.length === 0) return undefined;
    
    // Group by package type and sum view counts and durations
    const packageStats = new Map<string, { count: number; totalDuration: number; latest: PackageViewTracking }>();
    
    for (const view of userViews) {
      const existing = packageStats.get(view.packageType);
      if (existing) {
        existing.count += (view.viewCount || 1);
        existing.totalDuration += (view.viewDuration || 0);
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
    
    // Find package with highest engagement (combination of views and time spent)
    let bestPackage: PackageViewTracking | undefined;
    let bestScore = 0;
    
    for (const [packageType, stats] of packageStats) {
      const score = stats.count * 10 + stats.totalDuration; // Weight views more than duration
      if (score > bestScore) {
        bestScore = score;
        bestPackage = stats.latest;
      }
    }
    
    return bestPackage;
  }

  async updateLastReminderSent(userId: number, packageType: string): Promise<void> {
    await db.update(packageViewTracking)
      .set({ lastReminderSent: new Date(), updatedAt: new Date() })
      .where(and(
        eq(packageViewTracking.userId, userId),
        eq(packageViewTracking.packageType, packageType)
      ));
  }

  // Quote operations
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const result = await db.insert(quotes).values(quote).returning();
    return result[0];
  }

  async getQuotes(userId?: number): Promise<Quote[]> {
    if (userId) {
      return await db.select().from(quotes)
        .where(eq(quotes.userId, userId))
        .orderBy(desc(quotes.createdAt));
    }
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const result = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
    return result[0];
  }

  // Project operations
  async createProject(project: InsertProject): Promise<UserProject> {
    const result = await db.insert(userProjects).values(project).returning();
    return result[0];
  }

  async getUserProjects(userId: number): Promise<UserProject[]> {
    return await db.select().from(userProjects)
      .where(eq(userProjects.userId, userId))
      .orderBy(desc(userProjects.createdAt));
  }

  async getProject(id: number): Promise<UserProject | undefined> {
    const result = await db.select().from(userProjects).where(eq(userProjects.id, id)).limit(1);
    return result[0];
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<UserProject | undefined> {
    const result = await db.update(userProjects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userProjects.id, id))
      .returning();
    
    return result[0];
  }

  // Activity logging
  async logActivity(activity: {
    userId?: number;
    adminId?: number;
    action: string;
    target?: string;
    targetId?: number;
    details?: any;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ActivityLog> {
    const result = await db.insert(activityLogs).values({
      ...activity,
      createdAt: new Date()
    }).returning();
    
    return result[0];
  }

  async getActivityLogs(userId?: number, limit?: number): Promise<ActivityLog[]> {
    let query = db.select().from(activityLogs);
    
    if (userId) {
      query = query.where(eq(activityLogs.userId, userId));
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    return await query.orderBy(desc(activityLogs.createdAt));
  }

  // Payment operations (stub implementations)
  async createPayment(payment: any): Promise<any> {
    // TODO: Implement payment table operations
    return payment;
  }

  async getPayment(id: number): Promise<any | undefined> {
    // TODO: Implement payment table operations
    return undefined;
  }

  async getPaymentByStripeId(stripePaymentIntentId: string): Promise<any | undefined> {
    // TODO: Implement payment table operations
    return undefined;
  }

  async getUserPayments(userId: number): Promise<any[]> {
    // TODO: Implement payment table operations
    return [];
  }

  async updatePayment(id: number, data: Partial<any>): Promise<any | undefined> {
    // TODO: Implement payment table operations
    return undefined;
  }

  // Subscription operations (stub implementations)
  async createSubscription(subscription: any): Promise<any> {
    // TODO: Implement subscription table operations
    return subscription;
  }

  async getSubscription(id: number): Promise<any | undefined> {
    // TODO: Implement subscription table operations
    return undefined;
  }

  async getSubscriptionByStripeId(stripeSubscriptionId: string): Promise<any | undefined> {
    // TODO: Implement subscription table operations
    return undefined;
  }

  async getUserSubscriptions(userId: number): Promise<any[]> {
    // TODO: Implement subscription table operations
    return [];
  }

  async getAllSubscriptions(): Promise<any[]> {
    // TODO: Implement subscription table operations
    return [];
  }

  async updateSubscription(id: number, data: Partial<any>): Promise<any | undefined> {
    // TODO: Implement subscription table operations
    return undefined;
  }

  // Invoice operations (stub implementations)
  async createInvoice(invoice: any): Promise<any> {
    // TODO: Implement invoice table operations
    return invoice;
  }

  async getInvoice(id: number): Promise<any | undefined> {
    // TODO: Implement invoice table operations
    return undefined;
  }

  async getInvoiceByStripeId(stripeInvoiceId: string): Promise<any | undefined> {
    // TODO: Implement invoice table operations
    return undefined;
  }

  async getUserInvoices(userId: number): Promise<any[]> {
    // TODO: Implement invoice table operations
    return [];
  }

  async updateInvoice(id: number, data: Partial<any>): Promise<any | undefined> {
    // TODO: Implement invoice table operations
    return undefined;
  }
}

// Use database storage in production, memory storage for development/testing
export const storage = process.env.NEON_DATABASE_URL ? new DatabaseStorage() : new MemStorage();