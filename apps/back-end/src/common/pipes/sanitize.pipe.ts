import { PipeTransform, Injectable } from '@nestjs/common';
import * as DOMPurify from 'isomorphic-dompurify';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: unknown) {
    if (typeof value === 'object' && value !== null) {
      return this.sanitizeObject(value as Record<string, unknown>);
    }
    if (typeof value === 'string') {
      return DOMPurify.sanitize(value);
    }
    return value;
  }

  private sanitizeObject(
    obj: Record<string, unknown>,
  ): Record<string, unknown> {
    const sanitizedObj = { ...obj };
    for (const key in sanitizedObj) {
      const value = sanitizedObj[key];
      if (typeof value === 'string') {
        sanitizedObj[key] = DOMPurify.sanitize(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitizedObj[key] = this.sanitizeObject(
          value as Record<string, unknown>,
        );
      }
    }
    return sanitizedObj;
  }
}
