import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (this.isValidUrl(url)) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    throw new Error('Invalid URL provided');
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}