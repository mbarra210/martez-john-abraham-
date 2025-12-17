'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Office Location',
    details: ['123 Legal Plaza, Suite 500', 'New York, NY 10001']
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['(304) 303-9843', '24/7 Emergency Line']
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['rofilate007@gmail.com', 'Quick Response Guaranteed']
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Weekend by Appointment']
  }
];

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { firstName, lastName, email, phone, subject, message } = formData;

    if (!firstName || !lastName || !email || !subject || !message) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const fullMessage = {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        subject,
        message
      };

      const response = await fetch('/api/send-contact-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fullMessage)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const responseData = await response.json();
      if (!response.ok) {
        console.error('API Error Response:', responseData); // Log detailed error
        throw new Error(responseData.message || 'Failed to send consultation request');
      }

      toast.success('Message Sent', {
        description: <span style={{ color: 'black' }}>Thank you for reaching out. We&apos;ll get back to you soon.</span>
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit contact message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#001f3f] mb-4">Get In Touch</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Ready to discuss your legal needs? Contact us today for a confidential consultation.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Contact Information */}
          <div className="w-full md:w-1/2 space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="shadow-card border-0">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#001f3f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-[#001f3f]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#001f3f] mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="w-full md:w-1/2">
            <Card className="shadow-elegant border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-[#001f3f]">Send a Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={e => handleInputChange('firstName', e.target.value)}
                      placeholder="Enter your first name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={formData.lastName} onChange={e => handleInputChange('lastName', e.target.value)} placeholder="Enter your last name" required disabled={isSubmitting} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="Enter your email" required disabled={isSubmitting} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input type="tel" id="phone" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="Enter your phone number" disabled={isSubmitting} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={e => handleInputChange('subject', e.target.value)}
                    placeholder="Brief description of your legal matter"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={e => handleInputChange('message', e.target.value)}
                    placeholder="Please provide details about your legal needs..."
                    className="min-h-[120px]"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button variant="professional" size="lg" className="w-full" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="text-sm text-muted-foreground text-center">All communications are confidential and protected by attorney-client privilege.</p>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
