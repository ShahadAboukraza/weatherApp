import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../services/weather-services';

@Component({
  selector: 'app-weather-app',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-app.html',
  styleUrls: ['./weather-app.scss']
})
export class WeatherApp implements OnInit {
  city = 'Dubai';
  weatherData: any = null;
  error: string | null = null;
  userName: string = 'Shahad Osama';

  forecastData: any[] = [];



  weatherQuotes: string[] = [
    "The sun always shines above the clouds.",
    "Wherever you go, no matter the weather, always bring your own sunshine.",
    "A rainy day is the perfect time for a walk in the woods.",
    "Sunshine is the best medicine.",
    "Storms don’t last forever.",
    "Every cloud has a silver lining.",
    "Chase the sun, catch the vibes.",
    "Cold hands, warm heart.",
    "Let the weather inspire you.",
    "Blue skies, high vibes."
  ];

  randomQuote: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getWeather();
    this.setRandomQuote();
  }

  getWeather(): void {
    if (!this.city.trim()) return;

    this.weatherService.getWeatherByCity(this.city).subscribe((data: any) => {
      if (!data || data.error || !data.main) {
        this.error = 'Oops! City not found';
        this.weatherData = null;
        this.forecastData = [];
      } else {
        this.weatherData = data;
        this.error = null;
        this.setRandomQuote();

        // 🌤 Load 5-day forecast
        this.weatherService.getForecastByCity(this.city).subscribe((forecast: any) => {
          if (forecast && forecast.list) {
            this.forecastData = this.extractDailyForecast(forecast.list);
            console.log(this.forecastData)
          }
        });
      }
    });
  }


  setRandomQuote(): void {
    const index = Math.floor(Math.random() * this.weatherQuotes.length);
    this.randomQuote = this.weatherQuotes[index];
  }

  get getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good\nMorning';
    if (hour >= 12 && hour < 17) return 'Good\nAfternoon';
    if (hour >= 17 && hour < 21) return 'Good\nEvening';
    return 'Good\nNight';
  }

  extractDailyForecast(list: any[]): any[] {
    const groupedByDate: { [date: string]: any[] } = {};

    for (const item of list) {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0];

      if (!groupedByDate[dayKey]) {
        groupedByDate[dayKey] = [];
      }
      groupedByDate[dayKey].push(item);
    }

    const daily: any[] = [];

    for (const date in groupedByDate) {
      const forecasts = groupedByDate[date];

      // Get the forecast closest to 12:00 PM
      let closest = forecasts[0];
      let minDiff = Math.abs(new Date(closest.dt * 1000).getHours() - 12);

      for (const forecast of forecasts) {
        const hour = new Date(forecast.dt * 1000).getHours();
        const diff = Math.abs(hour - 12);
        if (diff < minDiff) {
          minDiff = diff;
          closest = forecast;
        }
      }

      const dayName = new Date(closest.dt * 1000).toLocaleDateString('en-US', {
        weekday: 'short'
      });

      daily.push({
        day: dayName,
        temp: Math.round(closest.main.temp),
        icon: closest.weather[0].icon
      });

      if (daily.length === 5) break;
    }

    return daily;
  }



}
