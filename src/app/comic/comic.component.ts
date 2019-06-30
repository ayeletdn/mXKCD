import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { XkcdService } from '../xkcd.service';


type comic = {
  month?: string,
  num: number,
  link?: string,
  year?: string,
  news?: string,
  safe_title?: string,
  transcript?: string,
  alt?: string,
  img?: string,
  title?: string,
  day?: string,
  imgRetina?: string
};

@Component({
  selector: 'app-comic',
  templateUrl: './comic.component.html',
  styleUrls: ['./comic.component.css']
})
export class ComicComponent implements OnInit {
  comic: comic;
  comicId: number;

  constructor(
      private xkcd: XkcdService,
      private route: ActivatedRoute
  ) { }

  random() {
      const id = Math.floor(Math.random() * this.xkcd.highest);
      this.xkcd.getComic(id)
          .subscribe((data:comic) => {this.comic = data});
  }

  byId(id:number) {
      // this.comicId = id;
      if (id > this.xkcd.highest) {
          console.warn('Requesting id above max. Reducing to today');
          return this.today();
      }
      this.xkcd.getComic(id)
          .subscribe((data:comic) => {
              this.comic = data
          });
  }

  today() {
      this.xkcd.getComic()
          .subscribe((data:comic) => {
              this.comic = data;
          });
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.xkcd.init(() => {
      if (id && parseInt(id)) {
        this.byId(parseInt(id));
      } else {
        this.today();
      }  
    });

  }
}
