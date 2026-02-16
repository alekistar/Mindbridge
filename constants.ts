import { Collection, Topic, Quiz } from './types';

// Crisis keywords for detection
export const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'hurt myself', 'end it all', 'die', 'death', 'overdose', 'cut myself'
];

export const CRISIS_RESOURCES = {
  text: "You are not alone. Help is available.",
  hotline: "988 (USA/Canada) or 111 (UK)",
  cta: "Get urgent help",
  url: "https://www.google.com/search?q=suicide+hotline"
};

export const CHATBOT_SYSTEM_PROMPT = `You are a calm, empathetic, safety-first assistant for teens. Keep replies concise (≤80 words), non-judgmental, and supportive. Provide listening prompts, brief coping strategies, and links to resources. Never diagnose or give prescriptive medical advice. Always include 'This is not medical advice.' If the user expresses self-harm or immediate danger, immediately display a crisis banner with emergency contacts, encourage contacting local emergency services, and escalate to a human moderator where available. When making factual claims include a source citation.`;

// Mock Data derived from prompt requirements
export const TOPICS: Topic[] = [
  {
    id: '1',
    title: "Coping with Exam Stress",
    slug: "coping-exam-stress",
    type: 'youtube',
    summary: "Practical strategies teens can use before and during exams to manage stress; includes breathing and brief cognitive tips.",
    youtubeId: "MB5IX-np5fE", 
    channelName: "Ali Abdaal",
    sourceUrl: "https://www.youtube.com/watch?v=MB5IX-np5fE",
    publishedAt: "2024-05-01",
    tags: ["stress", "school", "anxiety"],
    estimatedTime: 12
  },
  {
    id: '2',
    title: "Understanding Anxiety in Teens",
    slug: "understanding-anxiety",
    type: 'article',
    summary: "A short primer on signs of anxiety in adolescents and first-line coping strategies, curated and summarized from trusted sources.",
    sourceUrl: "https://www.thelowdown.co.nz/article/anxiety-in-teens",
    publishedAt: "2023-11-20",
    tags: ["anxiety", "education"],
    author: "The Lowdown"
  },
  {
    id: '3',
    title: "3-Minute Grounding Exercise",
    slug: "grounding-exercise",
    type: 'youtube',
    summary: "A short guided grounding practice to reduce acute anxiety and return focus to the present moment.",
    youtubeId: "IDPDEKtd2yM",
    channelName: "Therapy in a Nutshell",
    sourceUrl: "https://www.youtube.com/watch?v=IDPDEKtd2yM",
    publishedAt: "2023-12-10",
    tags: ["grounding", "panic", "quick-help"],
    estimatedTime: 3
  },
  {
    id: '4',
    title: "5-minute Grounding Technique",
    slug: "5-min-grounding-guide",
    type: 'guide',
    summary: "A step-by-step interactive guide to the 5-4-3-2-1 grounding technique.",
    publishedAt: "2024-01-15",
    tags: ["guide", "grounding"],
    estimatedTime: 5,
    steps: [
      "Look around and name 5 things you can see.",
      "Close your eyes or look down. Name 5 slow breaths.",
      "Notice 4 things you can touch or feel against your skin.",
      "Listen carefully. Name 3 things you can hear.",
      "Identify 2 things you can smell (or favorite smells).",
      "Name 1 thing you are grateful for right now."
    ],
    references: ["https://www.verywellmind.com/grounding-techniques-5207342"]
  },
  {
    id: '5',
    title: "Mindful Breathing for Beginners",
    slug: "mindful-breathing",
    type: 'youtube',
    summary: "Guided breathing practice for beginners to reduce acute stress.",
    youtubeId: "AwKGnVMluwA", 
    channelName: "Headspace",
    sourceUrl: "https://www.youtube.com/watch?v=AwKGnVMluwA",
    publishedAt: "2024-02-10",
    tags: ["meditation", "breathing"],
    estimatedTime: 10
  },
  {
    id: '6',
    title: "Progressive Muscle Relaxation",
    slug: "pmr-sleep",
    type: 'youtube',
    summary: "A therapist-led progressive muscle relaxation to help with body tension and sleep.",
    youtubeId: "8zP50wZZIFE",
    channelName: "Johns Hopkins Medicine",
    sourceUrl: "https://www.youtube.com/watch?v=8zP50wZZIFE",
    publishedAt: "2022-08-01",
    tags: ["sleep", "relaxation"],
    estimatedTime: 10
  },
  {
    id: '7',
    title: "Helping a Friend",
    slug: "talking-to-friend",
    type: 'article',
    summary: "Simple, evidence-based steps for supportive conversations with peers who might be struggling.",
    sourceUrl: "https://www.thelowdown.co.nz/article/talking-to-a-friend",
    publishedAt: "2023-07-15",
    tags: ["friends", "support"],
    author: "MindBridge Clinical Team"
  },
  {
    id: '8',
    title: "Sleep Routine Reset",
    slug: "sleep-reset-guide",
    type: 'guide',
    summary: "Get your sleep back on track with this simple checklist.",
    publishedAt: "2023-09-10",
    tags: ["sleep", "guide"],
    estimatedTime: 15,
    steps: [
      "Set a consistent bedtime and stick to it, even on weekends.",
      "Reduce screens 1 hour before bed. Blue light interferes with melatonin.",
      "Use a calming pre-sleep routine (reading, warm shower).",
      "Avoid caffeine after 2 PM."
    ]
  },
  {
    id: '9',
    title: "Understanding Panic Attacks",
    slug: "understanding-panic",
    type: 'youtube',
    summary: "An informative, teen-friendly explanation of panic attacks and quick coping strategies.",
    youtubeId: "dRLW7XlB318",
    channelName: "Child Mind Institute",
    sourceUrl: "https://youtube.com/shorts/dRLW7XlB318",
    publishedAt: "2024-01-20",
    tags: ["panic", "education"],
    estimatedTime: 8
  },
  {
    id: '10',
    title: "Managing Social Anxiety",
    slug: "social-anxiety-tips",
    type: 'youtube',
    summary: "Evidence-informed tips for handling social situations and building confidence.",
    youtubeId: "I_j1wMoSxjg",
    channelName: "Mind UK",
    sourceUrl: "https://www.youtube.com/watch?v=I_j1wMoSxjg",
    publishedAt: "2023-09-05",
    tags: ["social", "anxiety"],
    estimatedTime: 6
  }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    title: "Trending Now",
    slug: "trending",
    topicIds: ['1', '3', '5', '9']
  },
  {
    id: 'c2',
    title: "Guides & Tools",
    slug: "guides-tools",
    topicIds: ['4', '8', '3', '6']
  },
  {
    id: 'c3',
    title: "Staff Picks",
    slug: "staff-picks",
    topicIds: ['2', '7', '1', '4']
  },
  {
    id: 'c4',
    title: "For Sleep & Relaxation",
    slug: "sleep-relaxation",
    topicIds: ['6', '8', '5']
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'q1',
    title: "What's Your Stress Style?",
    slug: "stress-style",
    summary: "Find out how you typically react to stress and which coping strategies might work best for you.",
    estimatedTime: 2,
    questions: [
      {
        id: 'q1_1',
        text: "When a big deadline is coming up, how does your body feel?",
        options: [
          { text: "My heart races and I feel jittery.", value: 1 },
          { text: "I feel tired and want to shut down.", value: 2 },
          { text: "My muscles get tight (shoulders, jaw).", value: 3 },
          { text: "I don't notice physical changes.", value: 0 }
        ]
      },
      {
        id: 'q1_2',
        text: "What are your thoughts doing when you are stressed?",
        options: [
          { text: "Racing! I worry about everything at once.", value: 1 },
          { text: "Blank. I can't focus on anything.", value: 2 },
          { text: "Fixated. I obsess over one problem.", value: 3 },
          { text: "I distract myself with other things.", value: 0 }
        ]
      },
      {
        id: 'q1_3',
        text: "What helps you feel better usually?",
        options: [
          { text: "Moving my body or running.", value: 1 },
          { text: "Sleeping or resting.", value: 2 },
          { text: "Talking it out or writing it down.", value: 3 },
          { text: "Playing games or watching TV.", value: 0 }
        ]
      }
    ],
    results: [
      {
        minScore: 0,
        maxScore: 3,
        title: "The 'High Energy' Responder",
        description: "Your stress tends to show up as excess energy or anxiety. Calming techniques like deep breathing or vigorous exercise to burn off adrenaline might help.",
        recommendedTopicIds: ['3', '5', '9']
      },
      {
        minScore: 4,
        maxScore: 6,
        title: "The 'Freeze' Responder",
        description: "Stress makes you want to shut down or withdraw. Gentle movement and connecting with a friend can help you get 'unstuck'.",
        recommendedTopicIds: ['7', '8']
      },
      {
        minScore: 7,
        maxScore: 9,
        title: "The 'Tension' Holder",
        description: "You carry stress in your body. Progressive Muscle Relaxation is specifically designed for you.",
        recommendedTopicIds: ['6', '4']
      }
    ]
  },
  {
    id: 'q2',
    title: "Sleep Hygiene Check-up",
    slug: "sleep-check",
    summary: "Are your daily habits helping or hurting your sleep? Take this quick check.",
    estimatedTime: 1,
    questions: [
      {
        id: 'q2_1',
        text: "Do you use your phone in bed right before sleep?",
        options: [
          { text: "Yes, every night.", value: 0 },
          { text: "Sometimes.", value: 1 },
          { text: "No, never.", value: 2 }
        ]
      },
      {
        id: 'q2_2',
        text: "Is your bedroom dark and cool?",
        options: [
          { text: "No, it's bright or noisy.", value: 0 },
          { text: "It's okay.", value: 1 },
          { text: "Yes, it's a cave.", value: 2 }
        ]
      },
       {
        id: 'q2_3',
        text: "Do you drink caffeine (soda, coffee, energy drinks) after 2 PM?",
        options: [
          { text: "Yes, frequently.", value: 0 },
          { text: "Sometimes.", value: 1 },
          { text: "Rarely or never.", value: 2 }
        ]
      }
    ],
    results: [
      {
        minScore: 0,
        maxScore: 2,
        title: "Needs Improvement",
        description: "Your routine might be sabotaging your rest. Try changing one habit this week, like putting the phone away 30 mins before bed.",
        recommendedTopicIds: ['8', '6']
      },
      {
        minScore: 3,
        maxScore: 4,
        title: "Getting There",
        description: "You have some good habits, but there's room to tweak. Consistency is key!",
        recommendedTopicIds: ['8']
      },
      {
        minScore: 5,
        maxScore: 6,
        title: "Sleep Pro",
        description: "You're setting yourself up for success. Keep it up!",
        recommendedTopicIds: ['5']
      }
    ]
  }
];