// src/__mocks__/firebaseConfig.ts

// Mock Firebase services
export const auth = {
  // Add any auth methods your components/context might use, e.g.:
  onAuthStateChanged: jest.fn(() => jest.fn()), // Returns an unsubscribe function
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: 'mock-uid' } })),
  signOut: jest.fn(() => Promise.resolve()),
  // Add other methods as needed by your tests or components
};

export const analytics = {
  // Mock analytics methods if used, e.g.:
  logEvent: jest.fn(),
};

// You can also mock the app object if it's directly imported and used elsewhere,
// but typically mocking the exported services (auth, firestore, etc.) is sufficient.
// export const app = {};

console.log('Using mocked firebaseConfig.ts'); // For debugging to ensure mock is used
