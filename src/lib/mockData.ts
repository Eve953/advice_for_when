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
  "having a big exam",
  "starting a new job",
  "procrastinating on a project",
  "celebrating a win",
  "feeling overwhelmed",
  "losing a friend",
  "rainy Sunday afternoon"
] as const;

export type ScenarioType = typeof SCENARIOS[number];

export const MOCK_ADVICE: AdviceMessage[] = [
  // can't sleep
  {
    id: "m-1-1",
    scenario: "can't sleep",
    message: "The thoughts you are running from in the daylight have waited for the quiet. Let them speak, but do not mistake their noise for truth. The world is asleep; you are permitted to let go of the vigil.",
    timestamp: "2026-05-25T02:14:00Z"
  },
  {
    id: "m-1-2",
    scenario: "can't sleep",
    message: "Sleep is not a reward for a perfect day; it is a grace. You do not need to earn your rest. Let your limbs grow heavy and leave the unfinished work of being human to tomorrow.",
    timestamp: "2026-05-25T03:40:00Z"
  },
  {
    id: "m-1-3",
    scenario: "can't sleep",
    message: "Staring at the ceiling will not solve the grid lock. The night is a pause, not an arena. Close your eyes and watch the dark; it has no expectations of you.",
    timestamp: "2026-05-25T01:05:00Z"
  },

  // moving to a new city
  {
    id: "m-2-1",
    scenario: "moving to a new city",
    message: "You will feel like a ghost for the first three months, walking through streets that have no memory of you. Do not rush to fill the silence. Let the place learn your footsteps, and you will find that home is built in the spaces you did not plan.",
    timestamp: "2026-05-25T09:30:00Z"
  },
  {
    id: "m-2-2",
    scenario: "moving to a new city",
    message: "Every corner is a stranger until you look it in the eye. Get lost on purpose. The panic of not knowing where you are is the exact birthplace of discovery.",
    timestamp: "2026-05-25T11:15:00Z"
  },

  // feeling lonely
  {
    id: "m-3-1",
    scenario: "feeling lonely",
    message: "Loneliness is not the absence of people, but the presence of an unmet need for depth. Be tender with yourself. You are in your own company, and that company is valuable, even when it feels heavy.",
    timestamp: "2026-05-25T14:22:00Z"
  },
  {
    id: "m-3-2",
    scenario: "feeling lonely",
    message: "The silence in the room is not a vacuum. It is a canvas. Listen to the small sounds of the world breathing around you. You are connected by the shared air, even if the walls say otherwise.",
    timestamp: "2026-05-25T16:45:00Z"
  },

  // failing an exam
  {
    id: "m-4-1",
    scenario: "failing an exam",
    message: "A red mark on a sheet of paper is an evaluation of a moment, not an index of your intellect. Grieve the disappointment, then fold the paper and realize that your capability has always exceeded the boxes they draw to contain it.",
    timestamp: "2026-05-25T10:00:00Z"
  },
  {
    id: "m-4-2",
    scenario: "failing an exam",
    message: "The path of learning is crooked. This setback is just a detour, not the end of the road. Ask what this failure taught you about how you study, not about who you are.",
    timestamp: "2026-05-25T13:10:00Z"
  },

  // starting a new job
  {
    id: "m-5-1",
    scenario: "starting a new job",
    message: "Incompetence is the natural, honorable tax of growth. Everyone you admire was once standing where you are now, hoping no one would ask them a question they did not know how to answer. Breathe. You are learning a new language.",
    timestamp: "2026-05-25T08:00:00Z"
  },
  {
    id: "m-5-2",
    scenario: "starting a new job",
    message: "Your worth is not tied to how fast you memorize the acronyms. Show up, listen deeply, ask the basic questions, and remember that they hired your potential, not a finished product.",
    timestamp: "2026-05-25T08:30:00Z"
  },

  // heartbroken
  {
    id: "m-6-1",
    scenario: "heartbroken",
    message: "The ache you feel is the sudden expansion of a space that used to hold someone else. It is agonizing because it is empty. Do not try to shrink it back down. Let the space exist; in time, it will fill with your own wild, untamed strength.",
    timestamp: "2026-05-25T19:00:00Z"
  },
  {
    id: "m-6-2",
    scenario: "heartbroken",
    message: "It is a rare and terrible beauty to feel this much. The pain is proof that you risked yourself for something beautiful. Do not regret the risk. The scars will make you formidable, but they will not make you cold.",
    timestamp: "2026-05-25T20:30:00Z"
  },

  // celebrating a win
  {
    id: "m-7-1",
    scenario: "celebrating a win",
    message: "Let the joy settle deep into your marrow. Do not look past the peak to the next mountain immediately. Stand here. Look down at the path you climbed. Taste the air at this altitude. You earned this view.",
    timestamp: "2026-05-25T17:15:00Z"
  },
  {
    id: "m-7-2",
    scenario: "celebrating a win",
    message: "Victory is sweet, but sharing it is sweeter. Take a moment to thank the hands that helped build the scaffolding, and then buy yourself something that will remind you of this exact feeling when the clouds return.",
    timestamp: "2026-05-25T18:00:00Z"
  },

  // feeling overwhelmed
  {
    id: "m-8-1",
    scenario: "feeling overwhelmed",
    message: "You are trying to carry the whole horizon. Drop it. Look only at the next square foot of earth in front of you. Take one step. You do not have to solve the life you have not lived yet. Just live this next hour.",
    timestamp: "2026-05-25T12:00:00Z"
  },
  {
    id: "m-8-2",
    scenario: "feeling overwhelmed",
    message: "When the storm is loud, trying to quiet the wind is useless. Find your anchor. What is one small thing you can control? Drink a glass of water. Feel the solid floor. Start there.",
    timestamp: "2026-05-25T12:45:00Z"
  },

  // losing a friend
  {
    id: "m-9-1",
    scenario: "losing a friend",
    message: "Some connections are chapters, not whole books. It is natural to feel the grief of the ending even if you know the closing was necessary. Keep the gold they gave you, and leave the rust behind.",
    timestamp: "2026-05-25T15:30:00Z"
  },
  {
    id: "m-9-2",
    scenario: "losing a friend",
    message: "The silence where their voice used to be is deafening. Let the space be empty. Do not try to force a replacement. Some people are irreplaceable, but you will learn to navigate the map without them.",
    timestamp: "2026-05-25T16:00:00Z"
  },

  // rainy Sunday afternoon
  {
    id: "m-10-1",
    scenario: "rainy Sunday afternoon",
    message: "The rain is an alibi. You are officially excused from the world's demands. Let the kettle boil, listen to the drops slide down the glass, and write a letter to someone you haven't spoken to in years. The day belongs only to you.",
    timestamp: "2026-05-25T14:00:00Z"
  },
  {
    id: "m-10-2",
    scenario: "rainy Sunday afternoon",
    message: "Watch the grey light change the colors of the room. It is a slow, quiet theater. You are not wasting time; you are letting the soil of your mind rest. Let the seeds sleep.",
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
