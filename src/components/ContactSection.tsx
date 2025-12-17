'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { z } from 'zod';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Office Location',
    details: ['190-17 Union Turnpike, Fresh Meadows', 'NY 11366, United States']
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+1 (419) 607-7952', '24/7 Emergency Line']
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['martezjohnabraham@gmail.com', 'Quick Response Guaranteed']
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: ['Mon-Fri: 8:00 AM - 6:00 PM', 'Weekend by Appointment']
  }
];

// Validation schema
const contactSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, 'Please enter a valid phone number').optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(100, 'Subject must be less than 100 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters')
});

const ContactSection = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NO!; // Replace with your WhatsApp number

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const validated = contactSchema.parse(formData);

      // Create WhatsApp message
      const message = `*New Contact Message*

*Name:* ${validated.firstName} ${validated.lastName}
*Email:* ${validated.email}
*Phone:* ${validated.phone || 'N/A'}
*Subject:* ${validated.subject}
*Message:* ${validated.message}`;

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      toast.success('Opening WhatsApp', {
        description: <span style={{ color: 'black' }}>Your message is ready to send.</span>
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
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors: Record<string, string> = {};
        error.issues.forEach(issue => {
          const path = issue.path[0];
          if (path) {
            errors[path as string] = issue.message;
          }
        });
        setFieldErrors(errors);
        toast.error('Please fix the errors in the form');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
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
                      className={fieldErrors.firstName ? 'border-red-500' : ''}
                    />
                    {fieldErrors.firstName && <p className="text-sm text-red-500">{fieldErrors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={e => handleInputChange('lastName', e.target.value)}
                      placeholder="Enter your last name"
                      required
                      className={fieldErrors.lastName ? 'border-red-500' : ''}
                    />
                    {fieldErrors.lastName && <p className="text-sm text-red-500">{fieldErrors.lastName}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                      className={fieldErrors.email ? 'border-red-500' : ''}
                    />
                    {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className={fieldErrors.phone ? 'border-red-500' : ''}
                    />
                    {fieldErrors.phone && <p className="text-sm text-red-500">{fieldErrors.phone}</p>}
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
                    className={fieldErrors.subject ? 'border-red-500' : ''}
                  />
                  {fieldErrors.subject && <p className="text-sm text-red-500">{fieldErrors.subject}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={e => handleInputChange('message', e.target.value)}
                    placeholder="Please provide details about your legal needs..."
                    className={`min-h-[120px] ${fieldErrors.message ? 'border-red-500' : ''}`}
                    required
                  />
                  {fieldErrors.message && <p className="text-sm text-red-500">{fieldErrors.message}</p>}
                </div>

                <Button variant="professional" size="lg" className="w-full" type="submit">
                  Send via WhatsApp
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