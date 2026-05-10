'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ContactInfo {
  generalphone: string;
  generalemail: string;
  address: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function ContactPageContent() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    category: 'general',
    message: '',
    budget: '',
  });
  const { toast } = useToast();

  // Mock data - can be moved to Firebase later
  const departments = [
    { name: 'Admissions', phone: '+91-XXXX-XXXX-01', email: 'admissions@college.edu' },
    { name: 'Faculty Affairs', phone: '+91-XXXX-XXXX-02', email: 'faculty@college.edu' },
    { name: 'Student Services', phone: '+91-XXXX-XXXX-03', email: 'students@college.edu' },
    { name: 'Academics', phone: '+91-XXXX-XXXX-04', email: 'academics@college.edu' },
  ];

  const team = [
    { name: 'Dr. Principal', role: 'Principal', image: 'https://via.placeholder.com/150' },
    { name: 'Mr. Vice Principal', role: 'Vice Principal', image: 'https://via.placeholder.com/150' },
    { name: 'Ms. Registrar', role: 'Registrar', image: 'https://via.placeholder.com/150' },
    { name: 'Mr. Dean', role: 'Dean of Academics', image: 'https://via.placeholder.com/150' },
  ];

  const hours = [
    { day: 'Monday - Friday', time: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Closed' },
    { day: 'Holidays', time: 'Closed' },
  ];

  const faqItems: FAQItem[] = [
    {
      question: 'What are the admission requirements?',
      answer: 'Students must have completed their 12th grade with a minimum 50% score. Please visit our Admissions page for detailed requirements.',
    },
    {
      question: 'Do you offer scholarships?',
      answer: 'Yes, we offer merit-based and need-based scholarships. Contact our admissions office for more information.',
    },
    {
      question: 'What is the campus like?',
      answer: 'Our campus features modern classrooms, labs, library, sports facilities, and student accommodation. Visit our gallery for photos.',
    },
    {
      question: 'How do I apply online?',
      answer: 'You can apply through our website. Go to the Admissions page and click "Apply Online". The process takes about 15 minutes.',
    },
    {
      question: 'What are the placement statistics?',
      answer: 'Over 85% of our graduates are placed within 6 months of graduation. Average package is ₹4.5 LPA.',
    },
  ];

  const socialLinks = [
    { icon: Facebook, url: '#', label: 'Facebook' },
    { icon: Twitter, url: '#', label: 'Twitter' },
    { icon: Instagram, url: '#', label: 'Instagram' },
    { icon: Linkedin, url: '#', label: 'LinkedIn' },
  ];

  // Fetch contact info
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch('/api/contact');
        if (response.ok) {
          const data = await response.json();
          setContactInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch contact info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your message has been sent. We will get back to you soon!',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          category: 'general',
          message: '',
          budget: '',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-blue-100">
            We'd love to hear from you. Reach out to us through any of the methods below.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Contact Info Cards */}
        {!isLoading && contactInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Phone</h3>
                  <p className="text-muted-foreground">{contactInfo.generalphone}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground break-all">
                    <a href={`mailto:${contactInfo.generalemail}`} className="hover:text-blue-600 underline">
                      {contactInfo.generalemail}
                    </a>
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground whitespace-pre-line text-sm">{contactInfo.address}</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Hours of Operation */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Hours of Operation</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {hours.map((item, index) => (
              <Card key={index} className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <p className="font-semibold mb-2">{item.day}</p>
                <p className="text-muted-foreground">{item.time}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Department Contact Info */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Department Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <Card key={index} className="p-6">
                <h3 className="text-xl font-semibold mb-4">{dept.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-600" />
                    <a href={`mailto:${dept.email}`} className="text-blue-600 hover:underline">
                      {dept.email}
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form & Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Company name (if applicable)"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this about?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="admissions">Admissions</option>
                    <option value="academics">Academics</option>
                    <option value="faculty">Faculty Matter</option>
                    <option value="complaints">Complaint/Feedback</option>
                    <option value="placement">Placement Related</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-2">
                  Budget (if applicable)
                </label>
                <Input
                  id="budget"
                  name="budget"
                  placeholder="Enter budget range"
                  value={formData.budget}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message..."
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </Card>

          {/* Google Map */}
          <div className="flex flex-col gap-6">
            <Card className="p-8 flex-1">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.5832474255435!2d75.1945!3d14.8845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc8c8c8c8c8c8c9%3A0x0!2sG%20V%20Hallikeri%20College!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                />
              </div>
            </Card>

            {/* Social Media Links */}
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
              <div className="flex gap-4 flex-wrap">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.url}
                      className="p-3 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white rounded-full transition-colors"
                      title={link.label}
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* Team Directory */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-left">{item.question}</h3>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${expandedFAQ === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6 border-t pt-4 text-muted-foreground">
                    {item.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
