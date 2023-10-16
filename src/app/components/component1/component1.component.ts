import { Component } from '@angular/core';
import { MainStreamService } from "../../services/main-stream.service";
import { filter, map, OperatorFunction, Subject, take, takeUntil } from "rxjs";

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html'
})
export class Component1Component {
  destroy$: Subject<void> = new Subject<void>();
  numbers: number[] = [];

  constructor(private mainStreamService: MainStreamService) {}

  stopStream() {
    this.destroy$.next();
  }

  streamLogic(operator: OperatorFunction<number, number>) {
    this.stopStream();
    this.numbers = [];
    this.mainStreamService.getNumberStream()
      .pipe(takeUntil(this.destroy$), operator)
      .subscribe((number) => {
          this.numbers = [...this.numbers, number];
        },
      );
  }

  multiplyBy3() {
    this.streamLogic(map(v => v * 3))
  }

  getFirst7Values() {
    this.streamLogic(take(7))
  }

  getEvenNumbers() {
    this.streamLogic(filter(v => v % 2 === 0))
  }

  ngOnDestroy() {
    this.stopStream();
    this.destroy$.complete();
  }
}
