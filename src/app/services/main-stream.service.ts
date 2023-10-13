import {interval, take} from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainStreamService {
  getNumberStream() {
    return interval(1000).pipe(take(20))
  }
}
