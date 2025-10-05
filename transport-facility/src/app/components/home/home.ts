import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  constructor(private _router: Router) {

  }

  goTo(page: string){
    this._router.navigate([page]);
  }
}
