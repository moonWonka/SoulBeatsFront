// src/setupTests.ts
import 'whatwg-fetch'; // <-- Add this line at the top
import '@testing-library/jest-dom';

// Polyfill for TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any; // Use 'as any' if TypeScript complains about type mismatch
