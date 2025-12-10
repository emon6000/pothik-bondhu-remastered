export const translations = {
  en: {
    appTitle: "Pothik-bondhu",
    nav: {
      login: "Log In",
      logout: "Logout",
      guides: "Guides",
      about: "About",
      available: "Available",
      busy: "Busy"
    },
    hero: {
      version: "Version 3.3",
      welcome: "Welcome to",
      subtitle: "Your intelligent travel partner.",
      features: "Now with Smart Guide Booking & Dual Language!",
      fromLabel: "From",
      fromPlaceholder: "e.g. Dhaka",
      toLabel: "To",
      toPlaceholder: "e.g. Cox's Bazar",
      startBtn: "Start Journey",
      errorSame: "Start and Destination cannot be the same.",
      errorNotFound: "Could not find a district matching"
    },
    footer: {
      contact: "Contact Developer",
      rights: "All rights reserved."
    },
    chatbot: {
      title: "Pothik Assistant",
      status: "Online | Automated Support",
      greeting: "Hello! I am the Pothik-bondhu Assistant. Select a topic below to get started.",
      typing: "Pothik is typing...",
      suggested: "Suggested Questions",
      inputPlaceholder: "Select a question above..."
    }
  },
  bn: {
    appTitle: "পথিক-বন্ধু",
    nav: {
      login: "লগ ইন",
      logout: "লগ আউট",
      guides: "গাইড খুঁজুন",
      about: "সম্পর্কে",
      available: "ফাঁকা",
      busy: "ব্যস্ত"
    },
    hero: {
      version: "ভার্সন ৩.৩",
      welcome: "স্বাগতম জানাই",
      subtitle: "আপনার বুদ্ধিমান ভ্রমণ সঙ্গী।",
      features: "এখন স্মার্ট গাইড বুকিং এবং বাংলা ভাষা সহ!",
      fromLabel: "কোথা থেকে",
      fromPlaceholder: "যেমন: ঢাকা",
      toLabel: "কোথায় যাবেন",
      toPlaceholder: "যেমন: কক্সবাজার",
      startBtn: "যাত্রা শুরু করুন",
      errorSame: "যাত্রা শুরুর স্থান এবং গন্তব্য একই হতে পারে না।",
      errorNotFound: "এই নামের কোনো জেলা খুঁজে পাওয়া যায়নি"
    },
    footer: {
      contact: "ডেভেলপারের সাথে যোগাযোগ",
      rights: "সর্বস্বত্ব সংরক্ষিত।"
    },
    chatbot: {
      title: "পথিক অ্যাসিস্ট্যান্ট",
      status: "অনলাইন | স্বয়ংক্রিয় সেবা",
      greeting: "নমস্কার! আমি পথিক-বন্ধু অ্যাসিস্ট্যান্ট। আপনার প্রশ্নটি নিচে থেকে নির্বাচন করুন।",
      typing: "পথিক লিখছে...",
      suggested: "সচরাচর জিজ্ঞাসিত প্রশ্ন",
      inputPlaceholder: "উপর থেকে একটি প্রশ্ন নির্বাচন করুন..."
    }
  }
};

export interface ChatQnA {
  id: string;
  question: string;
  answer: string;
}

export const chatData: Record<'en' | 'bn', ChatQnA[]> = {
  en: [
    {
      id: "plan",
      question: "How do I plan a trip?",
      answer: "Enter your starting district in the 'From' box and destination in the 'To' box on the homepage, then click 'Start Journey' to see the route map."
    },
    {
      id: "find_guide",
      question: "How do I find a guide?",
      answer: "Click the 'Guides' button in the menu. You can search guides by district name. We have verified guides for all 64 districts."
    },
    {
      id: "book_guide",
      question: "How to contact/book a guide?",
      answer: "You must Log In first. Then find a guide and click 'Book Guide'. This will reveal their phone number and email."
    },
    {
      id: "register_guide",
      question: "Can I join as a guide?",
      answer: "Yes! Click 'Log In', switch to the 'Register' tab, select the 'Guide' icon, and fill in your details including service area."
    },
    {
      id: "cost",
      question: "Is this app free?",
      answer: "Yes, Pothik-bondhu is 100% free for travelers to plan trips and find guides."
    }
  ],
  bn: [
    {
      id: "plan",
      question: "কিভাবে ভ্রমণের পরিকল্পনা করব?",
      answer: "হোমপেজে 'কোথা থেকে' বক্সে যাত্রার শুরু এবং 'কোথায় যাবেন' বক্সে গন্তব্য লিখুন। এরপর 'যাত্রা শুরু করুন' বাটনে ক্লিক করলে ম্যাপ ও রুট দেখতে পাবেন।"
    },
    {
      id: "find_guide",
      question: "গাইড খুঁজব কিভাবে?",
      answer: "মেনু থেকে 'গাইড খুঁজুন' বাটনে ক্লিক করুন। সেখানে জেলার নাম দিয়ে সার্চ করে ৬৪ জেলার ভেরিফাইড গাইড খুঁজে পাবেন।"
    },
    {
      id: "book_guide",
      question: "গাইড বুক বা যোগাযোগ করব কিভাবে?",
      answer: "প্রথমে লগ ইন করুন। এরপর পছন্দমত গাইডের কার্ডে 'Book Guide' এ ক্লিক করলে তার ফোন নাম্বার ও ইমেইল দেখতে পাবেন।"
    },
    {
      id: "register_guide",
      question: "আমি কি গাইড হিসেবে যোগ দিতে পারি?",
      answer: "হ্যাঁ! 'লগ ইন' এ ক্লিক করে 'রেজিস্টার' ট্যাবে যান। সেখানে 'গাইড' আইকন সিলেক্ট করে আপনার তথ্য ও জেলার নাম দিয়ে রেজিস্ট্রেশন করুন।"
    },
    {
      id: "cost",
      question: "এই অ্যাপটি কি ফ্রি?",
      answer: "হ্যাঁ, ভ্রমণকারীদের জন্য রুট প্ল্যান করা এবং গাইড খোঁজা সম্পূর্ণ ফ্রি।"
    }
  ]
};