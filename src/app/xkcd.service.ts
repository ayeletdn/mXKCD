import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class XkcdService {

  constructor(private http: HttpClient) {}

  getComic(id?:number) {
    let path:string;
    
    if (id) {
      path = `https://xkcd.now.sh/${id}`;
    } else {
      path = "https://xkcd.now.sh";
    }
    return this.http.get(path);
  }

}
