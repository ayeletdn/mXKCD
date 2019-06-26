import { Component, OnInit } from '@angular/core';

// import { comic } from '../comic';
import { XkcdService } from './xkcd.service';

@Component({
    selector: 'mxkcd-comic',
    templateUrl: './mxkcd.component.html',
    styleUrls: ['./mxkcd.component.css']
  })
export class ComicComponent implements OnInit {
    comic: {num: number} = { num: 0 };
    highestNum = this.comic.num;
    comicId = this.comic.num;

    constructor(private xkcd: XkcdService) {
    }

    async random() {
        this.comicId = Math.floor(Math.random() * this.highestNum);
        console.log(`Getting random comic with id ${this.comicId}`);
        this.comic = await this.xkcd.getComic(this.comicId);
    }

    async byId(id:number) {
        console.log(`You requestd comic id ${id}`);
        if (id > this.highestNum) {
            console.warn('Requesting id above max. Reducing to today');
            return await this.today();
        }
        this.comic = await this.xkcd.getComic(id);
    }

    async today() {
        this.comic = await this.xkcd.getComic();
        this.comicId = this.comic.num;
        console.log('You requested today\'s comic');
    }

    async ngOnInit() {
        this.comic = await this.xkcd.getComic();
        this.highestNum = this.comic.num;
    }
}