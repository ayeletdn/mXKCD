import { Component, OnInit } from '@angular/core';

// import { comic } from '../comic';
import { XkcdService } from './xkcd.service';

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
    selector: 'mxkcd-comic',
    templateUrl: './mxkcd.component.html',
    styleUrls: ['./mxkcd.component.css']
  })
export class ComicComponent implements OnInit {
    comic: comic;
    highestNum: number;
    comicId: number;

    constructor(private xkcd: XkcdService) {
    }

    random() {
        const id = Math.floor(Math.random() * this.highestNum);
        this.xkcd.getComic(id)
            .subscribe((data:comic) => {this.comic = data});
    }

    byId(id:number) {
        // this.comicId = id;
        if (id > this.highestNum) {
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
                this.comic = data
                this.highestNum = this.comic.num;
            });
    }

    async ngOnInit() {
        this.today();
    }
}