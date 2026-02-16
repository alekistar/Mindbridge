import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-12 py-12 animate-fade-in max-w-4xl">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">About MindBridge</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-primary mb-4">Our Purpose</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            MindBridge was built to provide a safe, accessible, and calming digital space for teenagers to explore mental wellness strategies. 
            We believe that access to evidence-based coping mechanisms should be free, private, and stigma-free.
            Our platform aggregates trusted content from clinical experts and presents it in a way that respects your intelligence and your time.
          </p>
        </section>

        <section className="bg-blue-50 dark:bg-gray-800 p-8 rounded-xl border border-blue-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Safety & Crisis Resources</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            MindBridge is an educational tool, <strong>not a replacement for professional medical help</strong>. 
            We do not provide diagnosis or emergency services.
          </p>
          <div className="font-medium text-gray-900 dark:text-white">
            <p className="mb-2">If you or someone you know is in immediate danger:</p>
            <ul className="list-disc pl-5 space-y-1 text-red-600 dark:text-red-400">
              <li>Call your local emergency services (911 in US, 999 in UK).</li>
              <li>Call 988 (Suicide & Crisis Lifeline in US/Canada).</li>
              <li>Go to the nearest emergency room.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Content & Sourcing</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            We do not create clinical advice ourselves. All videos and articles featured on MindBridge are curated from reputable sources, including:
          </p>
          <ul className="grid md:grid-cols-2 gap-4">
            {['Licensed Therapists', 'Mental Health Nonprofits', 'University Research Centers', 'Public Health Organizations'].map((item) => (
              <li key={item} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h2>
          <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300">
            <p>
              Your privacy is paramount. Here is how we handle your data:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Journals:</strong> Stored locally on your device by default. We do not have access to your private entries in Guest Mode.</li>
              <li><strong>Tracking:</strong> We do not sell your data to third parties.</li>
              <li><strong>Chatbot:</strong> Conversations with the AI assistant are processed to generate replies but are not linked to your identity for advertising purposes.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Contact</h2>
          <p className="text-gray-700 dark:text-gray-300">
            For content takedown requests, partnership inquiries, or to report a bug, please contact us at:<br/>
            <a href="mailto:hello@mindbridge.demo" className="text-primary hover:underline">hello@mindbridge.demo</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;