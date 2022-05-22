import { Component, OnInit } from '@angular/core';
import { ReadStates } from "src/ReadStates";

import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-master-content',
  templateUrl: './master-content.component.html',
  styleUrls: ['./master-content.component.less'],
})
export class MasterContentComponent implements OnInit {
  readStates : ReadStates = new ReadStates();

  constructor() { }

  ngOnInit(): void {
  }
  
}
