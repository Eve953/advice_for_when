export interface AdviceMessage {
  id: string | number;
  scenario: string;
  message: string;
  timestamp: string;
}

export const SCENARIOS = [
  "can't sleep",
  "moving to a new city",
  "feeling extremely bored",
  "failed an exam",
  "starting a new job",
  "procrastinating on a project",
  "celebrating a win",
  "feeling overwhelmed",
  "making friends",
  "finding a career path"
] as const;

export type ScenarioType = typeof SCENARIOS[number];

export const MOCK_ADVICE: AdviceMessage[] = [
  // can't sleep
  {
    id: "m-1-1",
    scenario: "can't sleep",
    message: "Stressing can make things worse. Chilling in bed may feel more restful!",
    timestamp: "2026-05-25T02:14:00Z"
  },
  {
    id: "m-1-2",
    scenario: "can't sleep",
    message: "Finishing work can be left to tomorrow. Try meditation.",
    timestamp: "2026-05-25T03:40:00Z"
  },
  {
    id: "m-1-3",
    scenario: "can't sleep",
    message: "Remember that there are no expectations for you right now.",
    timestamp: "2026-05-25T01:05:00Z"
  },

  // moving to a new city
  {
    id: "m-2-1",
    scenario: "moving to a new city",
    message: "You will feel stressed at first, but it will pass.",
    timestamp: "2026-05-25T09:30:00Z"
  },
  {
    id: "m-2-2",
    scenario: "moving to a new city",
    message: "Every change is a new opportunity.",
    timestamp: "2026-05-25T11:15:00Z"
  },

  // feeling extremely bored
  {
    id: "m-3-1",
    scenario: "feeling extremely bored",
    message: "Try learning a new language! Whether a programming or human one, there are many resources online.",
    timestamp: "2026-05-25T14:22:00Z"
  },
  {
    id: "m-3-2",
    scenario: "feeling extremely bored",
    message: "Try an online class! Coursera has a lot of options.",
    timestamp: "2026-05-25T16:45:00Z"
  },

  // failing an exam
  {
    id: "m-4-1",
    scenario: "failed an exam",
    message: "A failed exam does not define you.",
    timestamp: "2026-05-25T10:00:00Z"
  },
  {
    id: "m-4-2",
    scenario: "failed an exam",
    message: "The most important thing is learning something!",
    timestamp: "2026-05-25T13:10:00Z"
  },

  // starting a new job
  {
    id: "m-5-1",
    scenario: "starting a new job",
    message: "Remember that you were hired for your worth!",
    timestamp: "2026-05-25T08:00:00Z"
  },
  {
    id: "m-5-2",
    scenario: "starting a new job",
    message: "It's normal to be anxious; just do your best.",
    timestamp: "2026-05-25T08:30:00Z"
  },

  // heartbroken
  {
    id: "m-6-1",
    scenario: "feeling overwhelmed",
    message: "Remember to be gentle with yourself and take breaks.",
    timestamp: "2026-05-25T19:00:00Z"
  },
  {
    id: "m-6-2",
    scenario: "feeling overwhelmed",
    message: "Remember how far you've come and the strength you've shown.",
    timestamp: "2026-05-25T20:30:00Z"
  },

  // celebrating a win
  {
    id: "m-7-1",
    scenario: "celebrating a win",
    message: "Congrats! Remember to take a break to celebrate!",
    timestamp: "2026-05-25T17:15:00Z"
  },
  {
    id: "m-7-2",
    scenario: "celebrating a win",
    message: "Try a new cafe or get a treat to celebrate!",
    timestamp: "2026-05-25T18:00:00Z"
  },

  //  procrastinating on a project
  {
    id: "m-8-1",
    scenario: "procrastinating on a project",
    message: "Try the Pomodoro technique! 25 minutes of work followed by a 5 minute break.",
    timestamp: "2026-05-25T12:00:00Z"
  },
  {
    id: "m-8-2",
    scenario: "procrastinating on a project",
    message: "Try breaking it up into smaller tasks!",
    timestamp: "2026-05-25T12:45:00Z"
  },

  // making a friend
  {
    id: "m-9-1",
    scenario: "making friends",
    message: "Try to join classes or clubs that interest you to meet new people.",
    timestamp: "2026-05-25T15:30:00Z"
  },
  {
    id: "m-9-2",
    scenario: "making friends",
    message: "Don't be afraid to talk to new people!",
    timestamp: "2026-05-25T16:00:00Z"
  },

  // rainy Sunday afternoon
  {
    id: "m-10-1",
    scenario: "finding a career path",
    message: "Try taking a few classes to see what you are interested in!",
    timestamp: "2026-05-25T14:00:00Z"
  },
  {
    id: "m-10-2",
    scenario: "finding a career path",
    message: "Try talking to people with careers you think are interesting!",
    timestamp: "2026-05-25T15:00:00Z"
  }
];

export function getRandomMockAdvice(scenario: string): AdviceMessage {
  const matching = MOCK_ADVICE.filter(
    (item) => item.scenario.toLowerCase() === scenario.toLowerCase()
  );
  if (matching.length === 0) {
    return {
      id: "fallback-default",
      scenario: scenario,
      message: "Be gentle with your own spirit. You are doing the best you can with what you have in this moment.",
      timestamp: new Date().toISOString()
    };
  }
  const randomIndex = Math.floor(Math.random() * matching.length);
  return matching[randomIndex];
}
