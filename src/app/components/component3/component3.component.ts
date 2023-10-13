import { Component } from '@angular/core';
import {MainStreamService} from "../../services/main-stream.service";
import {DestroyStreamService} from "../../services/destroy-stream.service";
import {combineLatest, forkJoin, interval, Observable, take, takeUntil, zip} from "rxjs";

@Component({
  selector: 'app-component3',
  templateUrl: './component3.component.html'
})
export class Component3Component {
  source1 = interval(200).pipe(take(10));
  source2 = interval(300).pipe(take(10));
  source3 = interval(400).pipe(take(10));

  output: string[] = [];

  constructor(private mainStreamService: MainStreamService,
              private destroyStreamService: DestroyStreamService) {}

  streamLogic(observable: Observable<[number, number, number]>) {
    this.destroyStreamService.stopStream();
    this.output = [];
    observable
      .pipe(takeUntil(this.destroyStreamService.destroy$))
      .subscribe((values) => {
        this.output = [...this.output, `[${values.join(', ')}]`]
      })
  }

  lastOf3AfterEachUpdate() {
    this.streamLogic(combineLatest(this.source1, this.source2, this.source3))
  }

  whenAllStop() {
    this.streamLogic(forkJoin(this.source1, this.source2, this.source3))
  }

  whenAllUpdated() {
    this.streamLogic(zip(this.source1, this.source2, this.source3))
  }

  ngOnDestroy() {
    this.destroyStreamService.competeStream();
  }
}
