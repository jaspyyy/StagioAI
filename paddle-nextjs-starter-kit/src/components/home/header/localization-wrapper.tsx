'use client';

import { useState } from 'react';
import { LocalizationBanner } from './localization-banner';

export function LocalizationWrapper() {
  const [country, setCountry] = useState('US');
  
  return (
    <LocalizationBanner country={country} onCountryChange={setCountry} />
  );
} 