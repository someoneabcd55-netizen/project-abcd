'use client';

export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  context: SecurityRuleContext;
  baseError?: Error;

  constructor(context: SecurityRuleContext, baseError?: Error) {
    const contextString = JSON.stringify(context, null, 2);
    const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${contextString}`;
    
    super(message);
    this.name = 'FirestorePermissionError';
    this.context = context;
    this.baseError = baseError;
    
    // This is necessary for transitioning a class to an Error in ES5
    Object.setPrototypeOf(this, FirestorePermissionError.prototype);
  }
}
