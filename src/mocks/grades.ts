import type { GradeTerm } from "@/features/classes/types";
// Demo scores only. Real APIs should return the instructor's published categories and scores.
function releasedTerm(
  period: string,
  {
    quiz,
    laboratory,
    assignment,
    exam,
  }: { quiz: number; laboratory: number; assignment: number | null; exam: number | null },
): GradeTerm {
  return {
    period,
    released: true,
    classStandingWeight: 70,
    examWeight: 30,
    categories: [
      {
        id: "quiz",
        name: "Quiz",
        weight: 30,
        assessments: [{ id: "quiz-1", name: "Written quiz", score: quiz, maxScore: 40 }],
      },
      {
        id: "laboratory",
        name: "Laboratory",
        weight: 30,
        assessments: [
          { id: "lab-1", name: "Guided activity", score: Math.min(laboratory, 20), maxScore: 20 },
          {
            id: "lab-2",
            name: "Practical exercise",
            score: laboratory - Math.min(laboratory, 20),
            maxScore: 30,
          },
        ],
      },
      {
        id: "assignment",
        name: "Assignment",
        weight: 40,
        assessments: [
          { id: "assignment-1", name: "Individual activity", score: assignment, maxScore: 20 },
        ],
      },
    ],
    exam: { score: exam, maxScore: 100 },
  };
}

const unreleased = (period: string): GradeTerm => ({ period, released: false });

export const grades: Record<string, GradeTerm[]> = {
  it311: [
    releasedTerm("Midterm", { quiz: 36, laboratory: 46, assignment: 19, exam: 90 }),
    unreleased("Final"),
  ],
  it312: [
    releasedTerm("Midterm", { quiz: 36, laboratory: 45, assignment: 18, exam: 93 }),
    releasedTerm("Final", { quiz: 32, laboratory: 42, assignment: null, exam: null }),
  ],
  it313: [
    releasedTerm("Midterm", { quiz: 28, laboratory: 35, assignment: 15, exam: 72 }),
    unreleased("Final"),
  ],
  it310: [
    releasedTerm("Midterm", { quiz: 38, laboratory: 47, assignment: 19, exam: 93 }),
    releasedTerm("Final", { quiz: 36, laboratory: 45, assignment: 18, exam: 93 }),
  ],
  it314: [],
};
