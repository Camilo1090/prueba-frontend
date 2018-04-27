import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { TdLoadingService } from '@covalent/core';
import * as Datamap from 'datamaps';
import * as d3 from 'd3';

import { GeosportsService } from '../services/geosports.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer: ElementRef;

  params = {};
  map: any;

  selectedSex = 'All';
  sexValues = [
    'All',
    'Female',
    'Male'
  ];

  minAge: number;
  maxAge: number;

  emitMinAge: (event: KeyboardEvent) => void;
  emitMaxAge: (event: KeyboardEvent) => void;

  constructor(public geosportsService: GeosportsService,
              public _loadingService: TdLoadingService,
              private _changeDetectorRef: ChangeDetectorRef) {  }

  ngOnInit() {
    // subscribe to receive age inputs changes, with 300ms debounce
    this.minAgeChanges(300).subscribe(value => {
      // this.minAge = Number(value);
      this.updateParams();
      this.updateMap();
    });
    this.maxAgeChanges(300).subscribe(value => {
      // this.maxAge = Number(value);
      this.updateParams();
      this.updateMap();
    });
  }

  ngAfterViewInit() {
    this.firstMapRender();
    this.updateMap();
    this._changeDetectorRef.detectChanges();
  }

  // first render of the map (empty)
  firstMapRender(): void {
    const that = this;
    this.map = new Datamap({
      element: that.mapContainer.nativeElement,
      projection: 'mercator',
      responsive: true,
      fills: {
        defaultFill: '#F5F5F5'
      },
      data: {}
    });
  }

  // retrieves server data with params and updates map data
  updateMap(): void {
    this.registerLoading();
    this.geosportsService.count(this.params).subscribe(response => {
      this.drawMap(response);
      this.resolveLoading();
    });
  }

  // initially draws the map
  drawMap(rawData: any[] = []): void {
    document.getElementById('map-container').innerHTML = '';
    const dataset = this.parseRawData(rawData);

    const that = this;
    this.map = new Datamap({
      element: that.mapContainer.nativeElement,
      projection: 'mercator',
      responsive: true,
      fills: {
        defaultFill: '#F5F5F5'
      },
      data: dataset,
      geographyConfig: {
        borderColor: '#DEDEDE',
        highlightBorderWidth: 2,
        // don't change color on mouse hover
        highlightFillColor: (geo) => {
          return geo['fillColor'] || '#F5F5F5';
        },
        // only change border
        highlightBorderColor: '#B7B7B7',
        // show desired information in tooltip
        popupTemplate: (geo, data) => {
          // tooltip content
          return `<div class="hoverinfo">
            <strong> ${geo.properties.name} </strong>
            <br>Users: <strong> ${data.count} </strong>
            </div>`;
        }
      }
    });
  }

  // generates a data object from server retrieved data
  // that can be interpreted by the Datamaps library
  parseRawData(rawData: any[]): any {
    // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", count: 75},
    //   "FRA": { "fillColor": "#8dc386", count: 43 } }
    const dataset = {};

    // Colorize every country based on "count"
    // Colors should be unique for every value.
    // Create palette(using min/max series-value)
    const onlyValues = rawData.map((item) => {
      return item.count;
    });
    const minValue = Math.min.apply(null, onlyValues);
    const maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    // color can be whatever you wish
    const paletteScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range(['#EFEFFF', '#02386F']); // blue color

    // fill dataset in appropriate format
    rawData.forEach((item) => {
      // item example value ["USA", 70]
      const iso = item._id;
      const value = item.count;
      dataset[iso] = { count: value, fillColor: paletteScale(value) };
    });

    return dataset;
  }

  // updates the params object with the entered filters
  updateParams(): void {
    this.params = {};
    // sex param
    switch (this.selectedSex) {
      case 'Female': {
        this.params['sex'] = 'female';
        break;
      }
      case 'Male': {
        this.params['sex'] = 'male';
        break;
      }
      default: {
        break;
      }
    }
    // min age param
    if (this.minAge) {
      this.params['age.gte'] = this.minAge;
    }
    // max age param
    if (this.maxAge) {
      this.params['age.lte'] = this.maxAge;
    }
  }

  // function to handle the change of selected radio button of the sex button group
  onSexChanged(): void {
    this.updateParams();
    this.updateMap();
  }

  // returns an Observable that emits whenever emitInput() is called
  minAgeChanges(debounce: number): Observable<string> {
    return Observable.create(observer => {
      // setup emitInput() to forward values to the subscriber
      this.emitMinAge = (event: KeyboardEvent) => {
        observer.next((<HTMLInputElement>event.target).value);
      };
    }).distinctUntilChanged().debounceTime(debounce);
  }

  // returns an Observable that emits whenever emitInput() is called
  maxAgeChanges(debounce: number): Observable<string> {
    return Observable.create(observer => {
      // setup emitInput() to forward values to the subscriber
      this.emitMaxAge = (event: KeyboardEvent) => {
        observer.next((<HTMLInputElement>event.target).value);
      };
    }).distinctUntilChanged().debounceTime(debounce);
  }

  // window listener to resize the map on window resize
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.map.resize();
  }

  // function to reset the filters to default value
  resetFilters(): void {
    this.minAge = undefined;
    this.maxAge = undefined;
    this.selectedSex = 'All';
    this.updateParams();
    this.updateMap();
  }

  // Methods for the loading
  registerLoading(): void {
    this._loadingService.register('map');
  }

  resolveLoading(): void {
    this._loadingService.resolve('map');
  }

}
