import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service'; 
import { World, Product, Pallier } from './world';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  showManagers: boolean = true;
  badgeManagers: number = 0;

  constructor(private service: RestserviceService, private snackbar: MatSnackBar) { 
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
    this.calcBadgeManager();
  }

  onBuyDone(cout: number){
    // this.world.score += product.cout * product.quantite;
    this.world.money -= cout;
    this.calcBadgeManager();
  }

  onQtmultiClick(){
    this.qtmulti_pos++;
    if(this.qtmulti_pos == this.qtmulti_value.length){
      this.qtmulti_pos = 0;
    }
    this.qtmulti = this.qtmulti_value[this.qtmulti_pos];
  }

  hireManager(manager : Pallier){
    if(manager.seuil <= this.world.money){
      this.world.money -= manager.seuil;
      manager.unlocked = true;
      this.world.products.product[manager.idcible-1].managerUnlocked = true;
      this.popMessage(manager.name + " a été engagé !")
    }
  }

  calcBadgeManager(): void{
    this.badgeManagers = this.world.managers.pallier.filter(p => p.seuil <= this.world.money && p.unlocked == false).length;
  }

  popMessage(message : string) : void {
    this.snackbar.open(message, "", { duration : 2000 })
  }
}
