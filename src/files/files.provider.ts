import { Provider } from '@nestjs/common';
import * as CloudinaryLib from 'cloudinary';
export const Cloudinary = 'lib:cloudinary';

export const FilesProvider: Provider = {
  provide: Cloudinary,
  useValue: CloudinaryLib,
};
