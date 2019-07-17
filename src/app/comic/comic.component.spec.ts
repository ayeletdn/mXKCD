import { ComponentFixture, TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';


import { ComicComponent } from './comic.component';
import { XkcdService } from '../xkcd.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';


describe('ComicComponent', () => {
  let router: Router;
  let xkcdService: Partial<XkcdService>;
  let component: ComicComponent;
  let fixture: ComponentFixture<ComicComponent>;

  const mockData = {
    num: 2176,
    title: "title",
    img: "https://imgs.xkcd.com/comics/how_hacking_works.png",
    alt: "If only somebody had warned them that the world would roll them like this."
  };

  const xkcdServiceStub = jasmine.createSpyObj('XkcdService', ['init', 'getComic']);
  xkcdServiceStub.init.and.returnValue(Promise.resolve());
  xkcdServiceStub.getComic.and.returnValue(of(mockData));

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [ ComicComponent ],
      providers: [ 
        {provide: XkcdService, useValue: xkcdServiceStub},
        {provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({id: 1}))}}
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

  it('should show loading when created', () => {
    expect(component).toBeTruthy();
    const headers = fixture.debugElement.queryAll(By.css('h1'));
    expect(headers.length).toEqual(1);
    expect(headers[0].nativeElement.innerText).toContain('Loading');
    expect(xkcdService.init).toHaveBeenCalled();
  });

  it('should load the mock data', async(() => {
    fixture.detectChanges();
    // wait for getComic observable to complete, then
    fixture.whenStable().then(() => {
      expect(xkcdService.getComic).toHaveBeenCalledWith(1); // route param set in activatedRoute
      expect(component.comic.num).toEqual(mockData.num);
    });
  }));

  it('should render the mock data', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      // data updated in component, now render
      fixture.detectChanges();
      fixture.whenRenderingDone().then(() => {
        const headers = fixture.debugElement.queryAll(By.css('h1'));
        expect(headers.length).toEqual(1);
        expect(headers[0].nativeElement.innerText).toContain(mockData.title);
        expect(headers[0].nativeElement.innerText).toContain(mockData.num);
      });
    });
  }));
});
