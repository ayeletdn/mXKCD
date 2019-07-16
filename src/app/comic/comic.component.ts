import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { XkcdService } from '../xkcd.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


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
      private route: ActivatedRoute,
      private router: Router
  ) { }

  random() {
    const id = Math.floor(Math.random() * (this.xkcd.highest || 1000));
    this.router.navigate(['comic', id]);
  }

  byId(id:number) {
    if (id > this.xkcd.highest) {
        console.warn('Requesting id above max. Reducing to today');
        return this.today();
    }
    this.router.navigate(['comic', id]);
  }

  today() {
    this.xkcd.getComic()
        .subscribe((data:comic) => {
            this.comic = data;
        });
  }

  async ngOnInit() {
    // init the service once
    this.xkcd.init().then(() => {
      // subscribe to parameter watching
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => {
          // get a new commic when id changes
          const id = +params.get('id');
          return this.xkcd.getComic(id);
        }
        // change the comic data when observer says to.
      )).subscribe((data:comic) => this.comic = data);
    });

  }
}
