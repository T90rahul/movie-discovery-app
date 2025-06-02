import { SafeUrlPipe } from './safe-url.pipe';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeUrlPipe', () => {
  let pipe: SafeUrlPipe;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(() => {
    sanitizer = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    
    TestBed.configureTestingModule({
      providers: [
        { provide: DomSanitizer, useValue: sanitizer }
      ]
    });
    
    pipe = new SafeUrlPipe(sanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should sanitize URL', () => {
    const testUrl = 'https://www.youtube.com/embed/12345';
    pipe.transform(testUrl);
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(testUrl);
  });
});