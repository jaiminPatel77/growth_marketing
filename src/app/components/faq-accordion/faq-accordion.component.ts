import { Component, Input } from '@angular/core';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq-accordion',
  templateUrl: './faq-accordion.component.html',
  styleUrls: ['./faq-accordion.component.scss']
})
export class FaqAccordionComponent {
  
  @Input() faqs: FaqItem[] = [
    {
      question: "How long does it take to see results?",
      answer: "While initial optimizations yield results within the first 30 days, compound growth through our strategies typically shows significant ROI between months 3 and 6 depending on your sales cycle.",
      isOpen: false
    },
    {
      question: "Do you integrate with our existing CRM?",
      answer: "Yes. We integrate natively with Salesforce, HubSpot, Marketo, and Pipedrive. We also utilize custom API connections for bespoke setups.",
      isOpen: false
    },
    {
      question: "What is the typical ad spend requirement?",
      answer: "To ensure statistical significance and viable scaling, we recommend a minimum monthly media budget of $10,000 across digital channels.",
      isOpen: false
    },
    {
      question: "Is there a long-term contract?",
      answer: "We focus on long-term partnerships but operate on flexible 6-month initial agreements to prove value, transitioning to annual thereafter.",
      isOpen: false
    }
  ];

  toggleFaq(index: number) {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
    
    // Optional: Close others
    // this.faqs.forEach((faq, i) => {
    //   if (i !== index) faq.isOpen = false;
    // });
  }

}
