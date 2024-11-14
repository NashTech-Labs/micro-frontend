// multer.config.ts
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

export const multerConfig: MulterOptions = {
    dest: './uploads', // destination folder for uploaded files
};
