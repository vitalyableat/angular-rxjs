import { Component } from '@angular/core';
import {MainStreamService} from "../../services/main-stream.service";
import {DestroyStreamService} from "../../services/destroy-stream.service";
import {
  concatMap,
  delay,
  exhaustMap,
  filter,
  interval,
  mergeMap,
  of,
  OperatorFunction,
  repeat,
  take,
  takeUntil
} from "rxjs";

@Component({
  selector: 'app-component2',
  templateUrl: './component2.component.html',
})
export class Component2Component {
  numbers: number[] = [];

  constructor(private mainStreamService: MainStreamService,
              private destroyStreamService: DestroyStreamService) {}

  streamLogic(...operators: OperatorFunction<any, any>[]) {
    this.destroyStreamService.stopStream();
    this.numbers = [];
    this.mainStreamService.getNumberStream()
      //@ts-ignore
      .pipe(...operators)
      .pipe(takeUntil(this.destroyStreamService.destroy$))
      .subscribe(number => {
        this.numbers = [...this.numbers, number];
      });
  }

  delay200ms() {
    this.streamLogic(exhaustMap((value) => of(value).pipe(delay(200), repeat(200), takeUntil(this.mainStreamService.getNumberStream()))))
  }

  interval100NewStream() {
    this.streamLogic(concatMap(() => interval(100).pipe(take(10))))
  }

  getEvenValue5Times() {
    this.streamLogic(filter(v => v % 2 === 0), concatMap((value) => of(value).pipe(delay(400), repeat(5))))
  }

  everyValue5Times() {
    this.streamLogic(mergeMap((value) => of(value).pipe(delay(300), repeat(5))))
  }

  ngOnDestroy() {
    this.destroyStreamService.competeStream();
  }
}
