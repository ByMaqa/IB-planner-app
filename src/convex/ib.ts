import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUser } from "./users";
import { IB_SUBJECTS, SAMPLE_SYLLABUS } from "./ibData";

export const seedIBData = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return { seeded: false, message: "Not authenticated" };
    const existing = await ctx.db.query("ibSubjects").first();
    if (existing) return { seeded: false, message: "Already seeded" };
    for (const subject of IB_SUBJECTS) {
      await ctx.db.insert("ibSubjects", subject);
    }
    for (const [, topics] of Object.entries(SAMPLE_SYLLABUS)) {
      for (const topic of topics) {
        await ctx.db.insert("syllabusTopics", topic);
      }
    }
    return { seeded: true, count: IB_SUBJECTS.length };
  },
});

export const getAllSubjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("ibSubjects").order("asc").collect();
  },
});

export const getSubjectsByGroup = query({
  args: { group: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db.query("ibSubjects").withIndex("by_group", (q) => q.eq("group", args.group)).collect();
  },
});

export const getUserSubjects = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const userSubjects = await ctx.db.query("userSubjects").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    return Promise.all(userSubjects.map(async (us) => {
      const subject = await ctx.db.query("ibSubjects").withIndex("by_slug", (q) => q.eq("slug", us.subjectSlug)).first();
      return { ...us, subjectDetails: subject || null };
    }));
  },
});

export const addUserSubject = mutation({
  args: { subjectSlug: v.string(), level: v.union(v.literal("HL"), v.literal("SL"), v.literal("EE"), v.literal("TOK")), color: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const existing = await ctx.db.query("userSubjects").withIndex("by_user_subject", (q) => q.eq("userId", user._id).eq("subjectSlug", args.subjectSlug)).first();
    if (existing) throw new Error("Subject already added");
    return await ctx.db.insert("userSubjects", { userId: user._id, subjectSlug: args.subjectSlug, level: args.level, color: args.color });
  },
});

export const removeUserSubject = mutation({
  args: { id: v.id("userSubjects") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const subject = await ctx.db.get(args.id);
    if (!subject || subject.userId !== user._id) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const updateSubjectColor = mutation({
  args: { id: v.id("userSubjects"), color: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const subject = await ctx.db.get(args.id);
    if (!subject || subject.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(args.id, { color: args.color });
  },
});

export const getSyllabusTopics = query({
  args: { subjectSlug: v.string(), level: v.union(v.literal("HL"), v.literal("SL")) },
  handler: async (ctx, args) => {
    return await ctx.db.query("syllabusTopics").withIndex("by_subject_level", (q) => q.eq("subjectSlug", args.subjectSlug).eq("level", args.level)).collect();
  },
});

export const getSyllabusForSubject = query({
  args: { subjectSlug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query("syllabusTopics").withIndex("by_subject", (q) => q.eq("subjectSlug", args.subjectSlug)).collect();
  },
});

export const getUserTasks = query({
  args: { subjectSlug: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const slug = args.subjectSlug;
    let tasks;
    if (slug) {
      tasks = await ctx.db.query("studyTasks").withIndex("by_user_subject", (q) => q.eq("userId", user._id).eq("subjectSlug", slug)).collect();
    } else {
      tasks = await ctx.db.query("studyTasks").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    }
    return tasks.sort((a, b) => a.createdAt - b.createdAt);
  },
});

export const generateTasksFromSyllabus = mutation({
  args: { subjectSlug: v.string() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const userSubject = await ctx.db.query("userSubjects").withIndex("by_user_subject", (q) => q.eq("userId", user._id).eq("subjectSlug", args.subjectSlug)).first();
    if (!userSubject) throw new Error("Subject not in your list");
    if (userSubject.level === "EE" || userSubject.level === "TOK") throw new Error("Cannot generate syllabus tasks for EE or TOK");
    const topics = await ctx.db.query("syllabusTopics").withIndex("by_subject_level", (q) => q.eq("subjectSlug", args.subjectSlug).eq("level", userSubject.level as "HL" | "SL")).collect();
    if (topics.length === 0) throw new Error("No syllabus data available");
    const now = Date.now();
    let count = 0;
    for (const topic of topics) {
      for (const subtopic of topic.subtopics) {
        await ctx.db.insert("studyTasks", {
          userId: user._id, subjectSlug: args.subjectSlug, topicNumber: topic.topicNumber,
          subtopicName: subtopic.name, description: subtopic.description || subtopic.name,
          estimatedMinutes: Math.round(subtopic.hours * 60), completed: false, createdAt: now,
        });
        count++;
      }
    }
    return { created: count };
  },
});

export const toggleTaskCompletion = mutation({
  args: { taskId: v.id("studyTasks"), completed: v.boolean() },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== user._id) throw new Error("Not found");
    await ctx.db.patch(args.taskId, { completed: args.completed, completedAt: args.completed ? Date.now() : undefined });
  },
});

export const deleteTask = mutation({
  args: { taskId: v.id("studyTasks") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    const task = await ctx.db.get(args.taskId);
    if (!task || task.userId !== user._id) throw new Error("Not found");
    await ctx.db.delete(args.taskId);
  },
});

export const recordStudySession = mutation({
  args: { subjectSlug: v.string(), taskId: v.optional(v.id("studyTasks")), durationMinutes: v.number(), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    return await ctx.db.insert("studySessions", {
      userId: user._id, subjectSlug: args.subjectSlug, taskId: args.taskId,
      durationMinutes: args.durationMinutes, notes: args.notes, startedAt: Date.now(),
    });
  },
});

export const getStudySessions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    return await ctx.db.query("studySessions").withIndex("by_user", (q) => q.eq("userId", user._id)).order("desc").collect();
  },
});

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    const userSubjects = await ctx.db.query("userSubjects").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    const tasks = await ctx.db.query("studyTasks").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    const sessions = await ctx.db.query("studySessions").withIndex("by_user", (q) => q.eq("userId", user._id)).collect();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const totalEstimatedMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const completedMinutes = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.estimatedMinutes, 0);
    const totalStudyMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    return {
      totalSubjects: userSubjects.length, totalTasks, completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      totalEstimatedMinutes, completedMinutes, remainingMinutes: totalEstimatedMinutes - completedMinutes,
      totalStudyMinutes, sessionCount: sessions.length,
    };
  },
});

export const getUserSettings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    let settings = await ctx.db.query("userSettings").withIndex("by_user", (q) => q.eq("userId", user._id)).first();
    if (!settings) return { userId: user._id, studyStyle: "pomodoro" as const, defaultSessionMinutes: 25, accentColor: "green", showScanlines: true, preferredBreakMinutes: 5, isNew: true };
    return { ...settings, isNew: false };
  },
});

export const updateUserSettings = mutation({
  args: {
    studyStyle: v.optional(v.union(v.literal("pomodoro"), v.literal("block"), v.literal("flexible"))),
    defaultSessionMinutes: v.optional(v.number()),
    accentColor: v.optional(v.string()),
    showScanlines: v.optional(v.boolean()),
    preferredBreakMinutes: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    let settings = await ctx.db.query("userSettings").withIndex("by_user", (q) => q.eq("userId", user._id)).first();
    if (settings) {
      await ctx.db.patch(settings._id, args);
    } else {
      await ctx.db.insert("userSettings", {
        userId: user._id,
        studyStyle: args.studyStyle || "pomodoro",
        defaultSessionMinutes: args.defaultSessionMinutes || 25,
        accentColor: args.accentColor || "green",
        showScanlines: args.showScanlines ?? true,
        preferredBreakMinutes: args.preferredBreakMinutes || 5,
      });
    }
  },
});
