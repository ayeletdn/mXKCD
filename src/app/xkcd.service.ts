import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class XkcdService {
  highest:number = 0;
  private today;
  basePath:string = 'https://xkcd.now.sh';

  constructor(private http: HttpClient) {
  }

  init():Promise<void> {
    return new Promise((resolve, reject) => {
      // no need to initialize if already done.
      if (this.highest > 0) {
        return resolve();
      }

      this._getComic().subscribe({
        next: (data:{num:number}) => {
          this.today = data;
          this.highest = data.num;
          resolve();
        },
        error: err => { 
          console.error('Failed to init xkcd service'); 
          reject();
        }
      });

  
    });

  }

  getComic(id?:number):Observable<Object> {

    if (this.highest === 0) {
      console.error("Service was not initialized. You must call .init()");
    }

    if (!id || this.highest === id) {
      return of(this.today);
    }
    
    return this._getComic(id);
  }

  private _getComic(id?:number):Observable<Object> {
    let path:string;

    if (id && id < this.highest) {
      path = `${this.basePath}/${id}`;
    } else {
      path = `${this.basePath}`;
    }
    return this.http.get(path);
  }

}
