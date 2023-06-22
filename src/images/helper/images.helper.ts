import { BadRequestException } from '@nestjs/common';

export const renameImage = (req, file, cb) => {
  const name = file.originalname.split('.')[0];
  const fn = file.originalname;

  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  cb(null, `${name}-${randomName}${fn}`);
};

export const filterExtention = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new BadRequestException('Only image files are allowed!'), false);
  }
  cb(null, true);
};
