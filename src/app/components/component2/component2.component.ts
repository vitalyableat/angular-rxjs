import { Component } from '@angular/core';
import {MainStreamService} from "../../services/main-stream.service";
import {
  concatMap,
  delay,
  exhaustMap,
  filter,
  interval,
  mergeMap,
  of,
  OperatorFunction,
  repeat, Subject, switchMap,
  take,
  takeUntil
} from "rxjs";

@Component({
  selector: 'app-component2',
  templateUrl: './component2.component.html',
})
export class Component2Component {
  destroy$: Subject<void> = new Subject<void>();
  numbers: number[] = [];

  constructor(private mainStreamService: MainStreamService) {}

  stopStream() {
    this.destroy$.next();
  }

  streamLogic(...operators: OperatorFunction<any, any>[]) {
    this.stopStream();
    this.numbers = [];
    this.mainStreamService.getNumberStream()
      //@ts-ignore
      .pipe(...operators)
      .pipe(takeUntil(this.destroy$))
      .subscribe(number => {
        this.numbers = [...this.numbers, number];
      });
  }

  delay200ms() {
    this.streamLogic(switchMap((value) => of(value).pipe(delay(200), repeat(200), takeUntil(this.mainStreamService.getNumberStream()))))
  }

  interval100NewStream() {
    this.streamLogic(concatMap(() => interval(100).pipe(take(10))))
  }

  getEvenValue5Times() {
    this.streamLogic(filter(v => v % 2 === 0), exhaustMap((value) => of(value).pipe(delay(400), repeat(5))))
  }

  everyValue5Times() {
    this.streamLogic(mergeMap((value) => of(value).pipe(delay(300), repeat(5))))
  }

  ngOnDestroy() {
    this.stopStream();
    this.destroy$.complete();
  }
}
