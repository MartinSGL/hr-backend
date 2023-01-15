import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value))
      throw new BadRequestException(`${value} is not a valid MongoID`);

    return value;
  }
}
