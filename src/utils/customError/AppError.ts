class AppError extends Error {
  public ErrorMessage: string;
  public StatusCode: number;
  public status: 'fail' | 'error';
  public isOperational: boolean;

  constructor(ErrorMessage: string, Message: string, StatusCode: number) {
    super(Message);
    
    this.ErrorMessage = ErrorMessage;
    this.StatusCode = StatusCode;
    this.status = `${StatusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;