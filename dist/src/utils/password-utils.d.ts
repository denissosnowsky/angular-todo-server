export declare const hashPassword: (pass: string) => Promise<string>;
export declare const comparePassword: (bodyPass: string, hashedPass: string) => Promise<boolean>;
