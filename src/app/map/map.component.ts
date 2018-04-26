import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TdLoadingService } from "@covalent/core";
import * as Datamap from 'datamaps';
import * as d3 from 'd3';

import { GeosportsService } from "../services/geosports.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer: ElementRef;

  constructor(public geosportsService: GeosportsService,
              public _loadingService: TdLoadingService) { }

  ngOnInit() {
    // this.registerLoading();
  }

  ngAfterViewInit() {
    // this.drawMap();
    this.registerLoading();
    this.updateMap();
  }

  updateMap(): void {
    let params = [];
    this.geosportsService.count(params).subscribe(response => {
      this.drawMap(response);
      this.resolveLoading();
    });
  }

  drawMap(rawData: any[] = []): void {
    // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", count: 75},
    //   "FRA": { "fillColor": "#8dc386", count: 43 } }
    let dataset = {};

    // Colorize every country based on "count"
    // Colors should be unique for every value.
    // Create palette(using min/max series-value)
    let onlyValues = rawData.map((item) => {
      return item.count
    });
    const minValue = Math.min.apply(null, onlyValues);
    const maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    // color can be whatever you wish
    const paletteScale = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range(["#EFEFFF", "#02386F"]); // blue color

    // fill dataset in appropriate format
    rawData.forEach((item) => {
      // item example value ["USA", 70]
      const iso = item._id;
      const value = item.count;
      dataset[iso] = { count: value, fillColor: paletteScale(value) };
    });

    const that = this;
    const map = new Datamap({
      element: that.mapContainer.nativeElement,
      projection: 'mercator',
      responsive: true,
      fills: {
        defaultFill: "#F5F5F5"
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

  // Methods for the loading
  registerLoading(): void {
    this._loadingService.register('map');
  }

  resolveLoading(): void {
    this._loadingService.resolve('map');
  }

}
