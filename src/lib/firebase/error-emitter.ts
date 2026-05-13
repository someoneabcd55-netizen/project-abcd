import { EventEmitter } from 'events';

// Since this is a simple emitter and doesn't rely on browser/node specifics,
// it can be used in a shared context. We will only instantiate it on the client.
class PermissionErrorEmitter extends EventEmitter {}

export const errorEmitter = new PermissionErrorEmitter();

