import { createWriteStream } from 'fs';

export function visitors() {
    return createWriteStream('./logs/visitors.log', { flags: 'a' });
}