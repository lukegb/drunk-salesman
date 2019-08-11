import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlotService } from '../plot.service';

@Component({
  selector: 'app-create-new-plot',
  templateUrl: './create-new-plot.component.html',
  styleUrls: ['./create-new-plot.component.scss']
})
export class CreateNewPlotComponent {

  constructor(private plotService: PlotService, private router: Router) { }

  pleaseWait = false;

  createOfflinePlot() {
    this.router.navigate(['plot', 'offline']);
  }

  async createFirestorePlot(): Promise<void> {
    this.pleaseWait = true;
    const plot = await this.plotService.createFirebasePlot();
    this.router.navigate(['plot', plot.id]);
  }

}
