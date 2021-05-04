import { Component } from '@angular/core';
import { PingService } from "./service/ping/ping.service"
import { PingResponse } from "./service/ping/ping.service"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'hefesto-front';
  apiVersion: String = "";

  constructor(private pingService: PingService) { }

  ngOnInit() {
    this.pingApi()
  }

  pingApi() {
    this.pingService.pingApi()
        .subscribe((data: PingResponse) => this.apiVersion = data.version );
  }
}
