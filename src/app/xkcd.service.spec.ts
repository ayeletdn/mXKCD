// Http testing module and mocking controller
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { XkcdService } from './xkcd.service';
import { of, Observable } from "rxjs";
import { TestScheduler } from 'rxjs/testing';


describe('XkcdService', () => {
  let service: XkcdService;
  let mockHttp: HttpTestingController;

  const mockData = {
    num: 1,
    title: "title"
  };

  const scheduler = new TestScheduler((actual, expected) => {
    // asserting the two objects are equal
    expect(actual).toEqual(expected);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [XkcdService]
    });

    // Inject the http service and test controller for each test
    service = TestBed.get(XkcdService);
    mockHttp = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    mockHttp.verify();
  });
  /// Tests begin ///

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {

    it('should have a highest value initially set to 0', () => {
      expect(service.highest).toEqual(0);
    });
  
    it('should not call the http service if heighest is greater than 0', () => {
      service.highest = 1;
      service.init();
      mockHttp.expectNone(service.basePath);
      expect().nothing();
    });
  
    it('should call the completion function when highest is greater than 0', (done) => {
      service.highest = 1;
      service.init().then(() => {
        expect(service.highest).toEqual(1);
        done();
      });
    });

    it('should set heighest after successfully getting the comic', () => {
      spyOn<any>(service, '_getComic').and.returnValue(of({num:1}));
      service.init();
      expect(service.highest).toEqual(1);
    });

    it('should call the external service', (done) => {
      service.init().then(() => {
        expect(service.highest).toEqual(mockData.num);
        done();
      });

      const request = mockHttp.expectOne(service.basePath);
      request.flush(mockData);
    });

    it("should log an error in .getComic if init isn't called", () => {
      spyOn(console, 'error');
      spyOn<any>(service, '_getComic').and.stub();
      service.getComic();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getComic', () => {
    beforeEach(() => {
      service.init();
      const request = mockHttp.expectOne(service.basePath);
      request.flush(mockData);
    });

    it("should return an observable", () => {
      const returnValue = service.getComic();
      expect(returnValue instanceof Observable).toBeTruthy();
    });

    it("should get the today's comic if no id was provided", done => {
      service.getComic().subscribe((data:{num:number}) => {
        expect(data.num).toEqual(mockData.num);
        done();
      })
    });

    it("should not fetch from network todays comic", done => {
      service.getComic().toPromise().then(done);
      mockHttp.expectNone(service.basePath);
      expect().nothing();
    });

    it("it should fetch todays comic if id is greater than highest", done => {
      service.getComic(service.highest + 1).subscribe((data:{num:number}) => {
        expect(data.num).toEqual(service.highest);
        done();
      });
      const request = mockHttp.expectOne(service.basePath);
      request.flush(mockData);
    });

    it("should fetch the comic if id was lower than highest", done => {
      service.highest = 100;
      const id:number = service.highest - 1;
      service.getComic(id).subscribe((data:{num:number}) => {
        expect(data.num).toEqual(id);
        done();
      });
      const request = mockHttp.expectOne(service.basePath + `/${id}`);
      mockData.num = id;
      request.flush(mockData);
    });
  });

});
