import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service'; 
import { World, Product, Pallier } from './world';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ISISCapitalist';
  world: World = new World();
  server: string;
  qtmulti: string;
  qtmulti_pos: number = 0;
  qtmulti_value: string[] = ["x1", "x10", "x100", "Max"];

  constructor(private service: RestserviceService) { 
    this.server = service.getServer(); 
    service.getWorld().then( world => { 
      this.world = world; 
    }); 
  }

  ngOnInit(): void {
    this.qtmulti = this.qtmulti_value[this.qtmulti_pos];
  }

  onProductionDone(product: Product){
    this.world.score += product.revenu * product.quantite;
    this.world.money += product.revenu * product.quantite;
  }

  onBuyDone(cout: number){
    // this.world.score += product.cout * product.quantite;
    this.world.money -= cout;
  }

  onQtmultiClick(){
    this.qtmulti_pos++;
    if(this.qtmulti_pos == this.qtmulti_value.length){
      this.qtmulti_pos = 0;
    }
    this.qtmulti = this.qtmulti_value[this.qtmulti_pos];
  }
}
