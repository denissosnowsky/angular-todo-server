import * as bcrypt from 'bcryptjs';

export const hashPassword = (pass: string): Promise<string> =>
  bcrypt.hash(pass, Number(process.env.SALT));

export const comparePassword = (
  bodyPass: string,
  hashedPass: string,
): Promise<boolean> => bcrypt.compare(bodyPass, hashedPass);
