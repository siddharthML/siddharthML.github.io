/* ============================================================================
   BOOKSHELF DATA  —  edit this file to change the bookshelf.
   Structure is plain JSON so scripts/fetch_covers.py can read it too.
   `slug` decides the cover filename: assets/covers/<slug>.jpg
   ============================================================================ */

const BOOKSHELF = {
  "categories": [
    {
      "name": "Product Strategy & Vision",
      "color": "blue",
      "icon": "compass",
      "books": [
        { "slug": "sales-pitch",          "title": "Sales Pitch",                                  "subtitle": "How to Craft a Story to Stand Out and Win", "author": "April Dunford" },
        { "slug": "ux-strategy",          "title": "UX Strategy",                                  "subtitle": "Devise Innovative Digital Products People Want", "author": "Jaime Levy" },
        { "slug": "make-something-wonderful", "title": "Make Something Wonderful",                 "subtitle": "Steve Jobs in his own words", "author": "Steve Jobs" },
        { "slug": "creative-selection",   "title": "Creative Selection",                           "subtitle": "Inside Apple's Design Process", "author": "Ken Kocienda" },
        { "slug": "design-everyday-things", "title": "The Design of Everyday Things",              "subtitle": "", "author": "Donald A. Norman" },
        { "slug": "platform-ecosystems",  "title": "Platform Ecosystems",                          "subtitle": "Aligning Architecture, Governance, and Strategy", "author": "Amrit Tiwana" }
      ]
    },
    {
      "name": "Org, Leadership & Scaling",
      "color": "pink",
      "icon": "users",
      "books": [
        { "slug": "managers-path",        "title": "The Manager's Path",                           "subtitle": "A Guide for Tech Leaders Navigating Growth", "author": "Camille Fournier" },
        { "slug": "only-paranoid-survive","title": "Only the Paranoid Survive",                    "subtitle": "", "author": "Andrew S. Grove" },
        { "slug": "how-google-works",     "title": "How Google Works",                             "subtitle": "", "author": "Eric Schmidt" },
        { "slug": "no-rules-rules",       "title": "No Rules Rules",                               "subtitle": "Netflix and the Culture of Reinvention", "author": "Reed Hastings" },
        { "slug": "lean-enterprise",      "title": "Lean Enterprise",                              "subtitle": "How High Performance Organizations Innovate at Scale", "author": "Jez Humble" },
        { "slug": "hbr-collaborative-teams","title": "HBR Guide to Collaborative Teams",           "subtitle": "", "author": "Harvard Business Review" },
        { "slug": "scrum",                "title": "Scrum",                                        "subtitle": "The Art of Doing Twice the Work in Half the Time", "author": "Jeff Sutherland" },
        { "slug": "skunk-works",          "title": "Skunk Works",                                  "subtitle": "A Personal Memoir of My Years at Lockheed", "author": "Ben R. Rich" },
        { "slug": "call-sign-chaos",      "title": "Call Sign Chaos",                              "subtitle": "Learning to Lead", "author": "Jim Mattis" }
      ]
    },
    {
      "name": "Data, Forecasting & Decision-Making",
      "color": "lavender",
      "icon": "chart",
      "books": [
        { "slug": "storytelling-with-data","title": "Storytelling with Data",                      "subtitle": "A Data Visualization Guide for Business Professionals", "author": "Cole Nussbaumer Knaflic" },
        { "slug": "forecasting-fpp",      "title": "Forecasting: Principles and Practice",          "subtitle": "", "author": "Rob J. Hyndman" },
        { "slug": "superforecasting",     "title": "Superforecasting",                             "subtitle": "The Art and Science of Prediction", "author": "Philip E. Tetlock" },
        { "slug": "thinking-fast-slow",   "title": "Thinking, Fast and Slow",                      "subtitle": "", "author": "Daniel Kahneman" },
        { "slug": "algorithms-to-live-by","title": "Algorithms to Live By",                        "subtitle": "The Computer Science of Human Decisions", "author": "Brian Christian" }
      ]
    },
    {
      "name": "Technical Grounding",
      "color": "aqua",
      "icon": "cpu",
      "books": [
        { "slug": "ai-engineering",       "title": "AI Engineering",                               "subtitle": "Building Applications with Foundation Models", "author": "Chip Huyen" },
        { "slug": "designing-ml-systems", "title": "Designing Machine Learning Systems",           "subtitle": "An Iterative Process for Production-Ready Applications", "author": "Chip Huyen" },
        { "slug": "ddia",                 "title": "Designing Data-Intensive Applications",        "subtitle": "", "author": "Martin Kleppmann" },
        { "slug": "swe-at-google",        "title": "Software Engineering at Google",               "subtitle": "Lessons Learned from Programming Over Time", "author": "Titus Winters" },
        { "slug": "clean-code",           "title": "Clean Code",                                   "subtitle": "A Handbook of Agile Software Craftsmanship", "author": "Robert C. Martin" },
        { "slug": "deep-generative-modeling","title": "Deep Generative Modeling",                  "subtitle": "", "author": "Jakub M. Tomczak" }
      ]
    },
    {
      "name": "Operations & Process Thinking",
      "color": "sand",
      "icon": "gear",
      "books": [
        { "slug": "the-goal",             "title": "The Goal",                                     "subtitle": "A Process of Ongoing Improvement", "author": "Eliyahu M. Goldratt" }
      ]
    },
    {
      "name": "Shipping Stories & War Stories",
      "color": "pink",
      "icon": "rocket",
      "books": [
        { "slug": "blood-sweat-pixels",   "title": "Blood, Sweat, and Pixels",                     "subtitle": "The Triumphant, Turbulent Stories Behind How Video Games Are Made", "author": "Jason Schreier" }
      ]
    },
    {
      "name": "Focus & Execution",
      "color": "blue",
      "icon": "target",
      "books": [
        { "slug": "deep-work",            "title": "Deep Work",                                    "subtitle": "Rules for Focused Success in a Distracted World", "author": "Cal Newport" }
      ]
    }
  ],

  "preview": [
    {
      "name": "AI & Engineering",
      "color": "lavender",
      "books": [
        { "title": "AI Engineering", "author": "Chip Huyen" },
        { "title": "Designing Machine Learning Systems", "author": "Chip Huyen" },
        { "title": "Designing Data-Intensive Applications", "author": "Martin Kleppmann" }
      ]
    },
    {
      "name": "Product & Strategy",
      "color": "sand",
      "books": [
        { "title": "Sales Pitch", "author": "April Dunford" },
        { "title": "Creative Selection", "author": "Ken Kocienda" },
        { "title": "Platform Ecosystems", "author": "Amrit Tiwana" }
      ]
    },
    {
      "name": "Leading & Deciding",
      "color": "pink",
      "books": [
        { "title": "The Manager's Path", "author": "Camille Fournier" },
        { "title": "Superforecasting", "author": "Philip E. Tetlock" },
        { "title": "Only the Paranoid Survive", "author": "Andrew S. Grove" }
      ]
    }
  ]
};
