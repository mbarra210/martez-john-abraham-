'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar as CalenderIcon, ChevronDownIcon, Phone, Mail, User, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { z } from 'zod';

interface ConsultationModalProps {
  children: React.ReactNode;
}

// Validation schema
const consultationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[\d\s\-\+\(\)]{10,}$/, 'Please enter a valid phone number'),
  caseType: z.enum(['criminal', 'personal-injury', 'family', 'business', 'estate', 'load', 'investment']),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  preferredDate: z
    .date()
    .refine(date => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    }, 'Please select a future date')
    .optional(),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/, 'Please enter a valid time')
});

const ConsultationModal = ({ children }: ConsultationModalProps) => {
  const [open, setFormOpen] = useState(false);
  const [openDate, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('10:30');

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NO!; // Replace with your WhatsApp number

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caseType: '',
    description: ''
  });

  const getCaseTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      criminal: 'Criminal Defense',
      'personal-injury': 'Personal Injury',
      family: 'Family Law',
      business: 'Business Law',
      estate: 'Estate Planning',
      load: 'Loan',
      investment: 'Investment'
    };
    return types[type] || type;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      // Validate form data
      const validationData = {
        ...formData,
        preferredDate: date,
        preferredTime: time
      };

      const validated = consultationSchema.parse(validationData);

      // Create WhatsApp message
      const message = `*New Consultation Request, we get in-touch with you shortly*

*Name:* ${validated.name}
*Email:* ${validated.email}
*Phone:* ${validated.phone}
*Case Type:* ${getCaseTypeName(validated.caseType)}
*Description:* ${validated.description || 'N/A'}
*Preferred Date:* ${validated.preferredDate ? validated.preferredDate.toLocaleDateString() : 'N/A'}
*Preferred Time:* ${validated.preferredTime}`;

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      toast.success('Opening WhatsApp', {
        description: <span style={{ color: 'black' }}>Your consultation request is ready to send.</span>
      });

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        caseType: '',
        description: ''
      });
      setDate(undefined);
      setTime('10:30');
      setFormOpen(false);
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

  // Disable past dates
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  };

  return (
    <Dialog open={open} onOpenChange={setFormOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-full [&>button]:hidden bg-transparent border-none py-0">
        <div className="bg-transparent">
          <div className="bg-white rounded-xl p-4 py-6 ">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#001f3f] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CalenderIcon className="w-6 h-6 text-[#d4af37]" />
                  Schedule a Consultation
                </div>
                <button onClick={() => setFormOpen(false)} className="text-black" aria-label="Close">
                  <X size={20} />
                </button>
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 px-2 mt-5 h-[500px] overflow-y-auto">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#001f3f]">Personal Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className={fieldErrors.name ? 'border-red-500' : ''}
                  />
                  {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className={fieldErrors.email ? 'border-red-500' : ''}
                  />
                  {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    className={fieldErrors.phone ? 'border-red-500' : ''}
                  />
                  {fieldErrors.phone && <p className="text-sm text-red-500">{fieldErrors.phone}</p>}
                </div>
              </div>

              {/* Case Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#001f3f]">Case Information</h3>

                <div className="space-y-2 w-full">
                  <Label htmlFor="caseType">Case Type *</Label>
                  <Select value={formData.caseType} onValueChange={value => handleInputChange('caseType', value)}>
                    <SelectTrigger className={fieldErrors.caseType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select the type of legal matter" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                      <SelectItem value="criminal">Criminal Defense</SelectItem>
                      <SelectItem value="personal-injury">Personal Injury</SelectItem>
                      <SelectItem value="family">Family Law</SelectItem>
                      <SelectItem value="business">Business Law</SelectItem>
                      <SelectItem value="estate">Estate Planning</SelectItem>
                      <SelectItem value="load">Loan</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldErrors.caseType && <p className="text-sm text-red-500">{fieldErrors.caseType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Case Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder="Briefly describe your legal matter..."
                    rows={4}
                    className={fieldErrors.description ? 'border-red-500' : ''}
                  />
                  {fieldErrors.description && <p className="text-sm text-red-500">{fieldErrors.description}</p>}
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="preferredDate">Preferred Consultation Date</Label>
                  <Popover open={openDate} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="date-picker" className={`w-32 justify-between font-normal ${fieldErrors.preferredDate ? 'border-red-500' : ''}`}>
                        {date ? date.toLocaleDateString() : 'Select date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={date => {
                          setDate(date);
                          setOpen(false);
                          // Clear error when user selects a date
                          if (fieldErrors.preferredDate) {
                            setFieldErrors(prev => ({ ...prev, preferredDate: '' }));
                          }
                        }}
                        disabled={disabledDays}
                      />
                    </PopoverContent>
                  </Popover>
                  {fieldErrors.preferredDate && <p className="text-sm text-red-500">{fieldErrors.preferredDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Consultation Time</Label>
                  <Input
                    type="time"
                    id="time-picker"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className={`bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none ${
                      fieldErrors.preferredTime ? 'border-red-500' : ''
                    }`}
                  />
                  {fieldErrors.preferredTime && <p className="text-sm text-red-500">{fieldErrors.preferredTime}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 text-white font-semibold">
                  Send via WhatsApp
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationModal;
