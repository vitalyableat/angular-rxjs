import { Component } from '@angular/core';
import {MainStreamService} from "../../services/main-stream.service";
import {filter, map, OperatorFunction, take, takeUntil, tap} from "rxjs";
import {DestroyStreamService} from "../../services/destroy-stream.service";

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html'
})
export class Component1Component {
  numbers: number[] = [];

  constructor(private mainStreamService: MainStreamService,
              private destroyStreamService: DestroyStreamService) {}

  streamLogic(operator: OperatorFunction<number, number>) {
    this.destroyStreamService.stopStream();
    this.numbers = [];
    this.mainStreamService.getNumberStream()
      .pipe(takeUntil(this.destroyStreamService.destroy$), operator)
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
    this.destroyStreamService.competeStream();
  }
}
