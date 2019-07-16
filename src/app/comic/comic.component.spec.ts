import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';


import { ComicComponent } from './comic.component';
import { XkcdService } from '../xkcd.service';
import { Observable } from 'rxjs';

describe('ComicComponent', () => {
  let xkcdServiceStub: Partial<XkcdService>;
  let router: Router;
  let xkcdService: Partial<XkcdService>; 
  let component: ComicComponent;
  let fixture: ComponentFixture<ComicComponent>;

  beforeEach(() => {
    xkcdServiceStub = {
      init: () => {return Promise.resolve()},
      getComic: (id?:number) => { return new Observable(); }
    }

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [ ComicComponent ],
      providers: [ 
        {provide: XkcdService, useValue: xkcdServiceStub},
        {provide: ActivatedRoute, useValue: { snapshot: {paramMap: convertToParamMap({id: 1})}}}
      ]
    });

    fixture = TestBed.createComponent(ComicComponent);
    component = fixture.componentInstance;
    xkcdService = TestBed.get(XkcdService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
