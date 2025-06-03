/**
 * Sanitizes error messages by removing potentially harmful characters
 * and formatting for safe console output
 */
export function sanitizeError(err: unknown): string {
  let message: string;
  
  if (typeof err === 'string') {
    message = err;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (err && typeof err === 'object' && 'message' in err && typeof (err as {message: unknown}).message === 'string') {
    message = (err as {message: string}).message;
  } else if (err && typeof err === 'object') {
    message = Object.prototype.toString.call(err);
  } else {
    message = 'Unknown error';
  }

  // Replace CR/LF/newlines to prevent fake log lines
  message = message.replace(/[\r\n]+/g, ' ');

  // Strip ANSI escape sequences and non-printables
  message = message.replace(
    /[\u001B\u009B][\[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
  // keep printable ASCII only
  message = message.replace(/[^\x20-\x7E]+/g, ''); 

  return message;
}