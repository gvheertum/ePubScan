import { Component, OnInit } from '@angular/core';
import { ReadStates } from "src/ReadStates";

@Component({
  selector: 'app-master-content',
  templateUrl: './master-content.component.html',
  styleUrls: ['./master-content.component.less']
})
export class MasterContentComponent implements OnInit {
  readStates : ReadStates = new ReadStates();

  constructor() { }

  ngOnInit(): void {
  }

}
