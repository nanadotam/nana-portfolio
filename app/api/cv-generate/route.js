import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { masterCV, jobDescription, metadata } = await request.json();

    if (!masterCV || !jobDescription) {
      return Response.json(
        { error: "masterCV and jobDescription are required" },
        { status: 400 }
      );
    }

    const { role, company, industry, yearsRequired, keyTechnologies, additionalContext } =
      metadata || {};

    // Build a concise version of the master CV to stay within context limits
    const cvSummary = {
      name: masterCV.cv_master?.name || masterCV.name || "Candidate",
      contact: masterCV.cv_master?.contact || masterCV.contact || {},
      summary: masterCV.cv_master?.summary || masterCV.summary || "",
      entries: (masterCV.cv_master?.entries || masterCV.entries || []).map((entry, idx) => ({
        index: idx,
        organization: entry.organization,
        period: entry.period,
        category: entry.category,
        role: entry.role,
        skills: entry.skills,
        impact: entry.impact,
        bullet_count: entry.bullet_points?.length || 0,
      })),
    };

    const prompt = `You are an expert CV/resume consultant and ATS optimization specialist.

TASK: Analyze the job description below and select the most relevant content from this candidate's master CV to create a tailored, ATS-optimized CV for the target role.

TARGET ROLE: ${role || "Not specified"}
COMPANY: ${company || "Not specified"}
${industry ? `INDUSTRY: ${industry}` : ""}
${yearsRequired ? `YEARS REQUIRED: ${yearsRequired}` : ""}
${keyTechnologies?.length ? `KEY TECHNOLOGIES: ${keyTechnologies.join(", ")}` : ""}
${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ""}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE MASTER CV:
${JSON.stringify(cvSummary, null, 2)}

INSTRUCTIONS:
1. Select the most relevant experiences/projects (by index) for this specific role
2. Choose a summary variant that best matches the role type
3. Identify priority skills that match the job description
4. For each selected experience, specify which bullet points are most relevant (by index, max 4 per entry)
5. Suggest a rewritten professional summary tailored to this role
6. Order experiences by relevance (most relevant first)

Return a JSON object with this exact structure:
{
  "summary_variant": "frontend" | "backend" | "fullstack" | "design" | "general",
  "tailored_summary": "A 2-3 sentence professional summary tailored to the target role...",
  "experience_indices": [0, 2, 4],
  "project_indices": [1, 3],
  "priority_skills": ["React", "TypeScript", "Next.js"],
  "reordered_achievements": {
    "0": [2, 0, 1],
    "2": [1, 0, 3]
  },
  "section_order": ["summary", "experience", "projects", "skills", "education", "certifications"],
  "reasoning": "Brief explanation of why these entries were selected..."
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const selection = JSON.parse(completion.choices[0].message.content);

    // Build the tailored CV content using the full master CV data
    const fullEntries = masterCV.cv_master?.entries || masterCV.entries || [];
    const selectedExperiences = (selection.experience_indices || [])
      .filter((i) => i < fullEntries.length)
      .map((i) => {
        const entry = fullEntries[i];
        const achievementOrder = selection.reordered_achievements?.[String(i)];
        const bullets = achievementOrder
          ? achievementOrder
              .filter((bi) => bi < (entry.bullet_points?.length || 0))
              .map((bi) => entry.bullet_points[bi])
          : (entry.bullet_points || []).slice(0, 4);

        return {
          ...entry,
          bullet_points: bullets,
        };
      });

    const selectedProjects = (selection.project_indices || [])
      .filter((i) => i < fullEntries.length)
      .map((i) => {
        const entry = fullEntries[i];
        const achievementOrder = selection.reordered_achievements?.[String(i)];
        const bullets = achievementOrder
          ? achievementOrder
              .filter((bi) => bi < (entry.bullet_points?.length || 0))
              .map((bi) => entry.bullet_points[bi])
          : (entry.bullet_points || []).slice(0, 3);

        return { ...entry, bullet_points: bullets };
      });

    return Response.json({
      selection,
      tailoredCV: {
        name: cvSummary.name,
        contact: cvSummary.contact,
        summary: selection.tailored_summary || cvSummary.summary,
        experiences: selectedExperiences,
        projects: selectedProjects,
        skills: selection.priority_skills || [],
        sectionOrder: selection.section_order || [
          "summary",
          "experience",
          "projects",
          "skills",
          "education",
        ],
      },
    });
  } catch (error) {
    console.error("CV generation error:", error);
    return Response.json(
      { error: error.message || "Failed to generate CV" },
      { status: 500 }
    );
  }
}
