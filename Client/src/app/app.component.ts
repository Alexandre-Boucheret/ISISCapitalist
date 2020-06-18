import { Component, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './restservice.service'; 
import { World, Product, Pallier } from './world';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ISISCapitalist';
  world: World = new World();
  server: string;
  username: string;
  qtmulti: string;
  qtmulti_pos: number = 0;
  qtmulti_value: string[] = ["x1", "x10", "x100", "Max"];
  showManagers: boolean = false;
  badgeManagers: number = 0;
  showUnlocks: boolean = false;
  showUpgrades: boolean = false;
  badgeUpgrades: number = 0;

  @ViewChildren(ProductComponent) productsComponent: QueryList<ProductComponent>;

  constructor(private service: RestserviceService, private snackbar: MatSnackBar) { 
    this.server = service.getServer(); 
    this.username = localStorage.getItem("username");
    if(!this.username){
      this.username = "Player" + Math.floor(Math.random() * 10000)
    }
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username)
    service.getWorld().then( world => { 
      this.world = world; 
      this.calcBadgeManager();
      this.calcBadgeUpgrade();
    }); 
  }

  ngOnInit(): void {
    this.qtmulti = this.qtmulti_value[this.qtmulti_pos];
  }

  onProductionDone(product: Product){
    this.world.score += product.revenu * product.quantite;
    this.world.money += product.revenu * product.quantite;
    this.calcBadgeManager();
    this.calcBadgeUpgrade();
  }

  onBuyDone(cout: number){
    this.world.money -= cout;
    this.calcBadgeManager();
    this.calcBadgeUpgrade();
  }

  onQtmultiClick(){
    this.qtmulti_pos++;
    if(this.qtmulti_pos == this.qtmulti_value.length){
      this.qtmulti_pos = 0;
    }
    this.qtmulti = this.qtmulti_value[this.qtmulti_pos];
  }

  onUsernameChanged(){
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
    document.location.reload(true);
  }

  hireManager(manager : Pallier){
    if(manager.seuil <= this.world.money){
      this.world.money -= manager.seuil;
      manager.unlocked = true;
      this.world.products.product[manager.idcible-1].managerUnlocked = true;
      this.popMessage(manager.name + " a été engagé !")
      this.service.putManager(manager);
    }
  }  
  
  buyUpgrade(upgrade : Pallier){
    if(upgrade.seuil <= this.world.money){
      this.service.putUpgrade(upgrade);
      this.world.money -= upgrade.seuil;
      if(upgrade.idcible == 0){
        this.productsComponent.first.calcUpgrade(upgrade);
      }else{
        this.productsComponent.find(c => c.product.id == upgrade.idcible).calcUpgrade(upgrade);
      }
      upgrade.unlocked = true;
    }
  }

  calcBadgeManager(): void{
    this.badgeManagers = this.world.managers.pallier.filter(p => p.seuil <= this.world.money && p.unlocked == false).length;
  }

  calcBadgeUpgrade(): void{
    this.badgeUpgrades = this.world.upgrades.pallier.filter(p => p.seuil <= this.world.money && p.unlocked == false).length;
  }

  popMessage(message : string) : void {
    this.snackbar.open(message, "", { duration : 2000 })
  }

}
