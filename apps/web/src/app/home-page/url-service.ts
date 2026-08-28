import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "./lands";

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  constructor(private router: Router, private dataService: DataService) {}

  navigateToFlatView(id: number): void {
    if(id >= 0 && id < this.dataService.lands.length) {
      const customUrl = `/flat-view/${id}`;
      this.router.navigateByUrl(customUrl);
    }
    else{
        console.error("Invalid land ID");
    }
  }
}