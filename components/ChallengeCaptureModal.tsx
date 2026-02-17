'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { sendChallengeSignup } from '@/lib/simple-webhook';

interface ChallengeCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonLocation?: string;
}

export function ChallengeCaptureModal({ isOpen, onClose, buttonLocation = 'unknown' }: ChallengeCaptureModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string; email?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: { firstName?: string; lastName?: string; email?: string } = {};

    if (!firstName.trim() || firstName.trim().length < 2) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim() || lastName.trim().length < 2) {
      newErrors.lastName = 'Last name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Send name and email to webhook
      await sendChallengeSignup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim()
      });

      // Build the payment link
      const basePaymentLink = 'https://checkout.oracleboxing.com/b/dRmeVe0tq78v4FZ9bDgQE1I';

      // Add customer data as query parameters
      const params = new URLSearchParams({
        prefilled_email: email.trim(),
        customer_name: `${firstName.trim()} ${lastName.trim()}`,
        customer_first_name: firstName.trim(),
        customer_last_name: lastName.trim(),
        button_location: buttonLocation
      });

      const paymentUrl = `${basePaymentLink}?${params.toString()}`;

      console.log('Redirecting to:', paymentUrl);

      // Small delay to ensure webhook completes before redirect
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to payment link
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Redirect error:', error);
      setErrors({
        email: 'Something went wrong. Please try again.'
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white text-gray-900 border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-section font-bold text-center text-gray-900">
            Step 1: Tell Us Who You Are
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-gray-700 text-body font-medium">
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                disabled={isLoading}
                className={`bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${errors.firstName ? 'border-red-500' : ''}`}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-body text-red-400" role="alert">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="text-gray-700 text-body font-medium">
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                disabled={isLoading}
                className={`bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${errors.lastName ? 'border-red-500' : ''}`}
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? 'lastName-error' : undefined}
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-body text-red-400" role="alert">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700 text-body font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading}
              className={`bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${errors.email ? 'border-red-500' : ''}`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-body text-red-400" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            No spam. Your information is secure and will never be shared.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all duration-200 ease-out transform hover:scale-[1.02] shadow-md hover:shadow-lg min-h-[48px] px-8 py-3 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Processing...' : (
              <>
                Go to Step 2: Checkout
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
