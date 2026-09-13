import React, { useState } from 'react';
import { UserCheck, FileText, UserPlus, ShieldAlert, CheckCircle, Navigation, ArrowRight } from 'lucide-react';

interface HowToSendMoneyProps {
  onStartTransfer: () => void;
}

const STEPS = [
  {
    number: 1,
    title: 'Sign up for free',
    description: "It only takes a few minutes—all you need is an email address, and you're ready to get started!",
    icon: UserPlus,
    tip: 'No monthly fees or commitments'
  },
  {
    number: 2,
    title: 'Get a quote',
    description: 'Choose your destination country, send & recipient currency, and send amount to generate a quote.',
    icon: FileText,
    tip: 'Guaranteed mid-market rate lock'
  },
  {
    number: 3,
    title: 'Add your recipient',
    description: "Provide your recipient's payment information (you'll need details like their name and address).",
    icon: UserCheck,
    tip: 'Save recipients for 1-click re-sending'
  },
  {
    number: 4,
    title: 'Verify your identity',
    description: "For some transfers, we may need identifying documents to confirm it's really you and keep your money safe.",
    icon: ShieldAlert,
    tip: 'Automated 60-second digital verification'
  },
  {
    number: 5,
    title: 'Confirm the quote',
    description: 'Confirm and fund your transfer with a bank account, credit card, or a debit card and you\'re done!',
    icon: CheckCircle,
    tip: 'Flexible domestic funding options'
  },
  {
    number: 6,
    title: 'Track your transfer',
    description: 'See where your money is and when it arrives to your recipient. Get live chat, phone and email support.',
    icon: Navigation,
    tip: 'Real-time SMS & email notifications'
  }
];

export const HowToSendMoney: React.FC<HowToSendMoneyProps> = ({ onStartTransfer }) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header from prompt */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How to send money online with Xe
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Simple, secure international transfers in 6 easy steps with bank-level security.
          </p>
        </div>

        {/* 6 Grid Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isSelected = selectedStep === step.number;

            return (
              <div
                key={step.number}
                onClick={() => setSelectedStep(step.number)}
                className={`relative p-8 rounded-2xl transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-50/50 border-[#0071eb] ring-2 ring-blue-100 shadow-lg'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#0a146e] text-white font-black text-xl flex items-center justify-center shadow-md">
                    {step.number}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-[#0071eb] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {step.description}
                </p>

                <div className="text-[11px] font-semibold text-[#0071eb] bg-blue-100/50 px-2.5 py-1 rounded-md inline-block">
                  ✓ {step.tip}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-14 text-center">
          <button
            id="how-to-send-cta"
            onClick={onStartTransfer}
            className="px-8 py-4 bg-[#0071eb] hover:bg-[#005ec4] text-white font-bold text-base rounded-full shadow-lg transition-all active:scale-95 inline-flex items-center gap-2"
          >
            <span>Start your transfer now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};
