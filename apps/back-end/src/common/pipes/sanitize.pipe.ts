import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as DOMPurify from 'isomorphic-dompurify';

@Injectable()
export class SanitizePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (typeof value === 'object' && value !== null) {
            return this.sanitizeObject(value);
        }
        if (typeof value === 'string') {
            return DOMPurify.sanitize(value);
        }
        return value;
    }

    private sanitizeObject(obj: any): any {
        const sanitizedObj = { ...obj };
        for (const key in sanitizedObj) {
            if (typeof sanitizedObj[key] === 'string') {
                sanitizedObj[key] = DOMPurify.sanitize(sanitizedObj[key]);
            } else if (typeof sanitizedObj[key] === 'object' && sanitizedObj[key] !== null) {
                sanitizedObj[key] = this.sanitizeObject(sanitizedObj[key]);
            }
        }
        return sanitizedObj;
    }
}
