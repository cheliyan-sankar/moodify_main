'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import StructuredData from '@/components/structured-data';

interface FAQItem {
  question: string;
  answer: string;
  id?: string;
}

interface FAQSectionProps {
  title: string;
  items?: FAQItem[];
  page?: string;
  schemaType?: 'HomePage' | 'GamesPage' | 'DiscoverPage' | 'AssessmentPage';
}

export function FAQSection({ title, items = [], page, schemaType = 'HomePage' }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>(items);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!page) return;
    fetchFaqs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchFaqs = async () => {
    if (!page) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/faqs?page=${encodeURIComponent(page)}`, { cache: 'no-store' });
      const data = await res.json();
      const nextFaqs = Array.isArray(data?.data) ? data.data : [];
      setFaqs(nextFaqs.length > 0 ? nextFaqs : items);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs(items);
    } finally {
      setLoading(false);
    }
  };

  const displayFaqs = faqs.length > 0 ? faqs : items;
  const shouldRenderSchema = displayFaqs.length > 0;

  // Generate Schema.org FAQ structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: displayFaqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      {shouldRenderSchema ? (
        <StructuredData id={`schema-faq-${page || schemaType}`}
          script={schemaData}
        />
      ) : null}

      <section className="py-6 sm:py-8 bg-gradient-to-br from-white via-secondary/20 to-accent/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="section-title font-bold text-primary mb-2">{title}</h2>
            <p className="text-base text-muted-foreground">
              Find answers to common questions about MoodLift
            </p>
          </div>

          <div className="space-y-3 px-2 sm:px-0">
            {loading ? (
              <p className="text-center text-muted-foreground">Loading FAQs...</p>
            ) : displayFaqs.length === 0 ? (
              <p className="text-center text-muted-foreground">No FAQs available</p>
            ) : (
              displayFaqs.map((item, index) => (
                <Card
                  key={index}
                  className="border-2 border-accent/30 hover:border-accent hover:shadow-md transition-all cursor-pointer overflow-hidden"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <CardHeader className="pb-0 py-3 px-4">
                    <CardTitle className="flex items-center justify-between text-base md:text-lg gap-4">
                      <span className="text-primary text-left font-semibold">{item.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-accent transition-transform duration-300 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </CardTitle>
                  </CardHeader>
                  {openIndex === index && (
                    <CardContent className="pt-2 pb-4 px-4 text-gray-700 leading-relaxed text-sm md:text-base animate-in fade-in-50 slide-in-from-top-2">
                      {item.answer}
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
