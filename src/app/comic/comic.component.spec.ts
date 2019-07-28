import { ComponentFixture, TestBed, fakeAsync, tick, async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';

import { ComicComponent } from './comic.component';
import { XkcdService } from '../xkcd.service';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';


describe('ComicComponent', () => {
  let xkcdService: Partial<XkcdService>;
  let component: ComicComponent;
  let fixture: ComponentFixture<ComicComponent>;
  let router:Router;

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
      declarations: [ ComicComponent ],
      providers: [ 
        {provide: XkcdService, useValue: xkcdServiceStub},
        {provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({id: 1}))}},
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }
      ]
    });

    xkcdService = TestBed.get(XkcdService);
    router = TestBed.get(Router);
    
    fixture = TestBed.createComponent(ComicComponent);
    component = fixture.componentInstance;
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

  describe('actions', () => {
    beforeEach(async(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        // data updated in component, now render
        fixture.detectChanges();
      });  
    }));

    it('should show the current comic ID in the text box', () => {
      const input = fixture.debugElement.query(By.css('input'));
      expect(input.nativeElement.value).toEqual(mockData.num.toString());
    });

    describe('by id', () => {

      it('should load comic by id in the text box', () => {
        const nextId = '123';
        spyOn(component, 'byId');
        const input = fixture.debugElement.query(By.css('input'));
        input.nativeElement.value = nextId;
        input.triggerEventHandler('keyup.enter', {});
        expect(component.byId).toHaveBeenCalledWith(nextId);
      });

      it('should load comic by id using byId bytton', () => {
        const nextId = '123';
        spyOn(component, 'byId');
        fixture.debugElement.query(By.css('input')).nativeElement.value = nextId;
        fixture.debugElement.query(By.css('#getById')).triggerEventHandler('click', {});
        expect(component.byId).toHaveBeenCalledWith(nextId);
      })

      it('should navigate to the correct url by comic id', fakeAsync(() => {
        component.byId(12);
        tick();
        expect(router.navigate).toHaveBeenCalledWith(['comic', 12]);
      }));
    });

    describe('random', () => {

      it('should call the random function when clicking on random', () => {
        spyOn(component, 'random');
        const button = fixture.debugElement.query(By.css('#getRandom'));
        button.triggerEventHandler('click', {});
        expect(component.random).toHaveBeenCalled();
      });
  
      it('should generate a random id in the range of service.highest', fakeAsync(() => {
        xkcdService.highest = 200;
        component.random();
        tick();
        const id = (router.navigate as jasmine.Spy).calls.mostRecent().args[0][1];
        expect(id).toBeLessThan(200);
      }));
  
    });

    describe('today', () => {
      it('should call today function when clicking today button', () => {
        spyOn(component, 'today');
        fixture.debugElement.query(By.css('#getToday')).triggerEventHandler('click', {});
        expect(component.today).toHaveBeenCalled();
      });

      it('should set the router to \'\' when calling today', () => {
        component.today();
        expect(router.navigate).toHaveBeenCalledWith(['']);
      });
    });
  })
});
