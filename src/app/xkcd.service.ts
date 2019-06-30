import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class XkcdService {
  highest:number = 0;
  private today;

  constructor(private http: HttpClient) {
  }

  init(completeHandler) {
    this._getComic().subscribe({
      next: (data:{num:number}) => {
        this.today = data;
        this.highest = data.num;
        completeHandler();
      },
      error: err => { console.error('Failed to init xkcd service'); }
    });
  }

  getComic(id?:number) {

    if (this.highest === 0) {
      console.error("Service was not initialized. You must call .init()");
    }

    if (!id) {
      return of(this.today);
    }
    
    return this._getComic(id);
  }

  _getComic(id?:number) {
    let path:string;

    if (id && id < this.highest) {
      path = `https://xkcd.now.sh/${id}`;
    } else {
      path = "https://xkcd.now.sh";
    }
    return this.http.get(path);
  }

}
