import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
@Component({
  selector: 'app-pata',
  templateUrl: './pata.component.html',
  styleUrls: ['./pata.component.css']
})
export class PataComponent implements OnInit {

  constructor(public darkModeService: DarkModeService) {}
  ngOnInit(): void {
  }
}
