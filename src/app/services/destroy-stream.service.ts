import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DestroyStreamService {
  destroy$: Subject<void> = new Subject<void>();

  stopStream() {
    this.destroy$.next();
  }

  competeStream() {
    this.stopStream();
    this.destroy$.complete();
  }
}
