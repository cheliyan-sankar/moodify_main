-- Add default SEO metadata for the Mood Check (assessment) page
INSERT INTO seo_metadata (
  page_url,
  title,
  description,
  keywords,
  og_image,
  twitter_card,
  canonical_url
) VALUES (
  '/assessment',
  'Mood Check & Assessment - Understand Your Emotional Health | MoodLift',
  'Take quick, clinically-informed mood assessments like PANAS, PHQ-9, and GAD-7 to understand your emotional health and get personalized wellness recommendations with MoodLift.',
  'mood check, mood assessment, mental health test, PHQ-9, GAD-7, PANAS, MoodLift',
  'https://moodlift.com/images/og-assessment.jpg',
  'summary_large_image',
  'https://moodlift.com/assessment'
)
ON CONFLICT (page_url) DO NOTHING;
