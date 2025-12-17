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

interface ConsultationModalProps {
  children: React.ReactNode;
}

const ConsultationModal = ({ children }: ConsultationModalProps) => {
  const [open, setFormOpen] = useState(false);
  const [openDate, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('10:30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caseType: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.caseType) {
      toast.error('Please fill in all required fields');
      setIsSubmitting(false);
      return;
    }

    try {
      const emailData = {
        ...formData,
        preferredDate: date ? date.toLocaleDateString() : '',
        preferredTime: time
      };

      const response = await fetch('/api/send-consultation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      const responseData = await response.json(); // Add this line to get the response body

      if (!response.ok) {
        console.error('API Error Response:', responseData); // Log detailed error
        throw new Error(responseData.message || 'Failed to send consultation request');
      }

      toast.success('Consultation Request Submitted', {
        description: <span style={{ color: 'black' }}>We&apos;ll contact you back soon to schedule your consultation.</span>
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
      console.error('Error sending consultation request:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit consultation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Enter your full name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input id="email" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="Enter your email address" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number *
                  </Label>
                  <Input id="phone" type="tel" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="Enter your phone number" required />
                </div>
              </div>

              {/* Case Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#001f3f]">Case Information</h3>

                <div className="space-y-2 w-full">
                  <Label htmlFor="caseType">Case Type *</Label>
                  <Select value={formData.caseType} onValueChange={value => handleInputChange('caseType', value)}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Case Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={e => handleInputChange('description', e.target.value)}
                    placeholder="Briefly describe your legal matter..."
                    rows={4}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Label htmlFor="preferredDate">Preferred Consultation Date</Label>
                  <Popover open={openDate} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="date-picker" className="w-32 justify-between font-normal">
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
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTime">Preferred Consultation Time</Label>
                  <Input
                    type="time"
                    id="time-picker"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setFormOpen(false)} className="flex-1" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 text-white font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Submit Request'}
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
