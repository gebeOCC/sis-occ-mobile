const isWeight = (value) => Number.isFinite(value) && value >= 0 && value <= 100;
const isScored = (item) =>
  item &&
  Number.isFinite(item.score) &&
  Number.isFinite(item.maxScore) &&
  item.maxScore > 0 &&
  item.score >= 0 &&
  item.score <= item.maxScore;
const totals100 = (values) =>
  values.every(isWeight) &&
  Math.abs(values.reduce((total, value) => total + value, 0) - 100) < 1e-6;

export const roundPercentage = (value) => Math.round(value + 1e-9);

/** OCC scale: 95+ -> 1.0, 94 -> 1.1, ... 75 -> 3.0, below 75 -> 5.0. */
export function gradeEquivalent(percentage) {
  if (!Number.isFinite(percentage) || percentage < 0) return null;
  const rounded = roundPercentage(percentage);
  if (rounded >= 95) return 1;
  if (rounded < 75) return 5;
  return (105 - rounded) / 10;
}

/** Preserve precision through weighting; incomplete/unreleased terms never become zero grades. */
export function calculateTermGrade(term) {
  if (term.released !== true)
    return { released: false, complete: false, equivalent: null, categories: [] };

  const categories = (term.categories ?? []).map((category) => {
    const assessments = category.assessments ?? [];
    const graded = assessments.filter(isScored);
    const earned = graded.reduce((sum, item) => sum + item.score, 0);
    const possible = graded.reduce((sum, item) => sum + item.maxScore, 0);
    const percentage = possible > 0 ? (earned / possible) * 100 : null;
    return {
      ...category,
      assessments,
      earned,
      possible,
      percentage,
      pending: assessments.length - graded.length,
      complete: assessments.length > 0 && assessments.length === graded.length,
      contribution:
        percentage !== null && isWeight(category.weight)
          ? (percentage * category.weight) / 100
          : null,
    };
  });
  const weightsValid =
    categories.length > 0 && totals100(categories.map((category) => category.weight));
  const standingComplete = weightsValid && categories.every((category) => category.complete);
  const standingPercentage = standingComplete
    ? categories.reduce((sum, category) => sum + category.contribution, 0)
    : null;
  const standingWeight = term.classStandingWeight ?? 70;
  const examWeight = term.examWeight ?? 30;
  const examPercentage = isScored(term.exam) ? (term.exam.score / term.exam.maxScore) * 100 : null;
  const weightsTotalValid = totals100([standingWeight, examWeight]);
  const standingContribution =
    standingPercentage !== null && isWeight(standingWeight)
      ? (standingPercentage * standingWeight) / 100
      : null;
  const examContribution =
    examPercentage !== null && isWeight(examWeight) ? (examPercentage * examWeight) / 100 : null;
  const complete = standingComplete && examPercentage !== null && weightsTotalValid;
  const percentage = complete ? standingContribution + examContribution : null;

  return {
    released: true,
    complete,
    categories,
    classStanding: {
      weight: standingWeight,
      percentage: standingPercentage,
      contribution: standingContribution,
    },
    exam: {
      ...term.exam,
      weight: examWeight,
      percentage: examPercentage,
      contribution: examContribution,
    },
    percentage,
    roundedPercentage: complete ? roundPercentage(percentage) : null,
    equivalent: complete ? gradeEquivalent(percentage) : null,
  };
}
