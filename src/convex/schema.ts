import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

export const subjectLevels = ["HL", "SL", "EE", "TOK"] as const;
export const subjectLevelValidator = v.union(
  v.literal("HL"),
  v.literal("SL"),
  v.literal("EE"),
  v.literal("TOK"),
);
export type SubjectLevel = (typeof subjectLevels)[number];

export const studyStyles = ["pomodoro", "block", "flexible"] as const;
export const studyStyleValidator = v.union(
  v.literal("pomodoro"),
  v.literal("block"),
  v.literal("flexible"),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
    }).index("email", ["email"]),

    // Built-in IB subject reference data
    ibSubjects: defineTable({
      name: v.string(),
      group: v.number(),
      groupName: v.string(),
      slug: v.string(),
      hasHL: v.boolean(),
      hasSL: v.boolean(),
      canBeEE: v.boolean(),
      color: v.string(),
    })
      .index("by_group", ["group"])
      .index("by_slug", ["slug"]),

    // User's selected subjects
    userSubjects: defineTable({
      userId: v.id("users"),
      subjectSlug: v.string(),
      level: subjectLevelValidator,
      color: v.string(),
    })
      .index("by_user", ["userId"])
      .index("by_user_subject", ["userId", "subjectSlug"]),

    // Syllabus topics per subject
    syllabusTopics: defineTable({
      subjectSlug: v.string(),
      level: v.union(v.literal("HL"), v.literal("SL")),
      topicNumber: v.string(),
      topicName: v.string(),
      subtopics: v.array(
        v.object({
          name: v.string(),
          hours: v.number(),
          description: v.optional(v.string()),
        })
      ),
      totalHours: v.number(),
    })
      .index("by_subject_level", ["subjectSlug", "level"])
      .index("by_subject", ["subjectSlug"]),

    // Study tasks generated from syllabus
    studyTasks: defineTable({
      userId: v.id("users"),
      subjectSlug: v.string(),
      topicNumber: v.string(),
      subtopicName: v.string(),
      description: v.string(),
      estimatedMinutes: v.number(),
      completed: v.boolean(),
      completedAt: v.optional(v.number()),
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_user_subject", ["userId", "subjectSlug"]),

    // Study timer sessions
    studySessions: defineTable({
      userId: v.id("users"),
      subjectSlug: v.string(),
      taskId: v.optional(v.id("studyTasks")),
      durationMinutes: v.number(),
      notes: v.optional(v.string()),
      startedAt: v.number(),
    }).index("by_user", ["userId"]),

    // User preferences
    userSettings: defineTable({
      userId: v.id("users"),
      studyStyle: studyStyleValidator,
      defaultSessionMinutes: v.number(),
      accentColor: v.string(),
      showScanlines: v.boolean(),
      preferredBreakMinutes: v.number(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  }
);

export default schema;
