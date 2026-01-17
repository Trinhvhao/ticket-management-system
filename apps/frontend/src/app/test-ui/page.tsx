'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Label } from '@/components/ui/Label';
import { useState } from 'react';

export default function TestUIPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">UI Components Test</h1>

        {/* Buttons */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Buttons</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button isLoading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Inputs</h2>
          <div className="space-y-4 max-w-md">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              helperText="Must be at least 6 characters"
            />
            <Input
              label="With Error"
              type="text"
              error="This field is required"
            />
            <Input
              label="Disabled"
              type="text"
              disabled
              value="Disabled input"
            />
          </div>
        </section>

        {/* Checkboxes */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Checkboxes</h2>
          <div className="space-y-3">
            <Checkbox id="check1" label="Remember me" />
            <Checkbox id="check2" label="I agree to terms and conditions" />
            <Checkbox id="check3" label="Disabled" disabled />
          </div>
        </section>

        {/* Labels */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Labels</h2>
          <div className="space-y-3">
            <Label>Normal Label</Label>
            <Label required>Required Label</Label>
          </div>
        </section>

        {/* Auth Store Test */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Auth Store Test</h2>
          <p className="text-sm text-gray-600 mb-4">
            Open browser console to see auth store state
          </p>
          <Button
            onClick={() => {
              const { useAuthStore } = require('@/lib/stores/auth.store');
              console.log('Auth Store State:', useAuthStore.getState());
            }}
          >
            Log Auth Store State
          </Button>
        </section>
      </div>
    </div>
  );
}
