import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.css'],
})
export class CalculationsComponent implements OnInit {
  winCount = 0;
  loseCount = 0;
  arr: boolean[];

  currentChoice: number;

  constructor() {}

  ngOnInit(): void {}

  calculate() {
    this.winCount = 0;
    this.loseCount = 0;
    for (let index = 0; index < 1000; index++) {
      this.calculateIteration();
    }
  }

  calculateIteration() {
    this.arr = [false, false, false];

    var rand = Math.floor(Math.random() * 3);
    this.arr[rand] = true;
    var currentChoice = Math.floor(Math.random() * 3);
    
    var remainingCount = 0;
    var remainingArr = new Array(2);
    
    for (let i = 0; i < this.arr.length; i++) {
      if(i != currentChoice) {
        remainingArr[remainingCount] = this.arr[i];
        remainingCount++;
      }
    }

    if(remainingArr[0] == true || remainingArr[1] == true) {
      this.winCount++;
    }
    else {
      this.loseCount++;
    }
  }
}
