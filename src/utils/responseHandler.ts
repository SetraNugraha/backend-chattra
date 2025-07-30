/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const successResponse = (message: string = 'Success', data: any) => {
  return {
    success: true,
    message,
    data,
  };
};
