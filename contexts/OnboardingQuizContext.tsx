import React, { createContext, useContext, useState, useCallback } from 'react';

type FrustrationAnswer = 'dont_know_where' | 'hard_to_save' | 'stress' | 'plan_better';
type DurationAnswer = 'few_months' | 'more_than_year' | 'always';
type GoalAnswer = 'less_stress' | 'reach_goals' | 'feel_free' | 'enjoy_life';

interface QuizState {
  frustration: FrustrationAnswer | null;
  duration: DurationAnswer | null;
  goal: GoalAnswer | null;
}

interface QuizContextValue extends QuizState {
  setFrustration: (answer: FrustrationAnswer) => void;
  setDuration: (answer: DurationAnswer) => void;
  setGoal: (answer: GoalAnswer) => void;
}

const OnboardingQuizContext = createContext<QuizContextValue | null>(null);

export function OnboardingQuizProvider({ children }: { children: React.ReactNode }) {
  const [frustration, setFrustration] = useState<FrustrationAnswer | null>(null);
  const [duration, setDuration] = useState<DurationAnswer | null>(null);
  const [goal, setGoal] = useState<GoalAnswer | null>(null);

  return (
    <OnboardingQuizContext.Provider
      value={{
        frustration,
        duration,
        goal,
        setFrustration: useCallback((a: FrustrationAnswer) => setFrustration(a), []),
        setDuration: useCallback((a: DurationAnswer) => setDuration(a), []),
        setGoal: useCallback((a: GoalAnswer) => setGoal(a), []),
      }}
    >
      {children}
    </OnboardingQuizContext.Provider>
  );
}

export function useOnboardingQuiz() {
  const ctx = useContext(OnboardingQuizContext);
  if (!ctx) throw new Error('useOnboardingQuiz must be used within OnboardingQuizProvider');
  return ctx;
}

export type { FrustrationAnswer, DurationAnswer, GoalAnswer };
