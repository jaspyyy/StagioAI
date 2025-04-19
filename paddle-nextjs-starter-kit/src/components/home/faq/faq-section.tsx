import React, { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: 'How does AI virtual staging differ from traditional virtual staging?',
    answer: 'AI virtual staging uses advanced artificial intelligence to automatically stage properties in seconds, while traditional virtual staging relies on manual work by designers that can take days. Our AI system has been trained on millions of interior design images to understand space, lighting, and design principles.',
  },
  {
    question: 'Is the quality of AI virtual staging comparable to traditional virtual staging?',
    answer: 'Yes, our AI virtual staging produces photorealistic results that match or exceed traditional virtual staging quality. The AI has been trained to understand lighting, shadows, perspective, and design principles to create naturally-looking staged photos.',
  },
  {
    question: 'Can I offer different design styles to my clients with AI virtual staging?',
    answer: 'Absolutely! Our AI system offers multiple design styles including modern, contemporary, traditional, minimalist, and more. You can instantly generate different versions of the same space with various furniture and decor styles.',
  },
  {
    question: 'How does AI virtual staging compare to traditional virtual staging in terms of cost?',
    answer: 'AI virtual staging is significantly more cost-effective than traditional virtual staging. With instant results and the ability to process multiple images quickly, you can save both time and money while maintaining high quality.',
  },
  {
    question: 'Can AI virtual staging remove existing furniture from photos?',
    answer: 'Yes, our AI can remove existing furniture and replace it with new virtual furniture. The system is trained to understand room layouts and can seamlessly replace existing items while maintaining proper perspective and lighting.',
  },
  {
    question: 'How can real estate photographers offer AI virtual staging as an upsell service?',
    answer: 'Real estate photographers can easily integrate our AI virtual staging as a premium service. You can offer instant previews during photoshoots, provide multiple design options, and deliver final staged images faster than traditional methods, all while maintaining higher profit margins.',
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-800">
      <button
        className="w-full py-4 md:py-6 text-left flex items-center justify-between focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-base md:text-lg font-medium text-white pr-4">{question}</h3>
        <span className={`text-yellow-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} flex-shrink-0`}>
          ▼
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 pb-4 md:pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-sm md:text-base text-gray-400 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-[32px]">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-medium mb-3 md:mb-4 text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
            Get answers to common questions about our AI-powered virtual staging service
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem key={index} question={item.question} answer={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
} 