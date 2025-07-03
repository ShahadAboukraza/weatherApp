import { Component } from '@angular/core';
import {WeatherApp} from './weather-app/weather-app';


@Component({
  selector: 'app-root',
  imports: [
    WeatherApp
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'weatherApp';
}
