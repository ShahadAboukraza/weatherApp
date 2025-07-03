import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = 'a113932254c24d61353ac6890a9c33f0';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeatherByCity(city: string) {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).pipe(
      catchError(error => of({ error: true, message: error.message }))
    );

  }

  getForecastByCity(city: string) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).pipe(
      catchError(error => of({ error: true, message: error.message }))
    );
  }

}
