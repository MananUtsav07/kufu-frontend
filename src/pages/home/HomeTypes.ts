import type { ReactNode, RefObject } from "react";

export interface Outcome {
  icon: string;
  title: string;
  description: string;
}

export interface Step {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface PricingPlan {
  title: string;
  description: string;
  monthlyPrice: string;
  onetimePrice: string;
  features: string[];
  popular: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface BotIconProps {
  size?: number;
}

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export interface FAQItemProps {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export type RevealHookReturn = [RefObject<HTMLDivElement | null>, boolean];
