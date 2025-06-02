import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {
  private apiKey = environment.tmdbApiKey;
  private baseUrl = environment.tmdbBaseUrl;

  constructor() {
    console.log('Environment:', environment);
    console.log('API Key:', environment.tmdbApiKey);
    console.log('Full URL:', `${environment.tmdbBaseUrl}/movie/popular?api_key=${environment.tmdbApiKey}`);
  }



  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Adding API key
    if (request.url.includes(this.baseUrl)) {
      // request is cloned and API parameter key is added 
      const modifiedRequest = request.clone({
        params: request.params.set('api_key', this.apiKey)
      });
      return next.handle(modifiedRequest);
    }
    return next.handle(request);
  }
}