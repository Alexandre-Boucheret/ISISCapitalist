import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product, Pallier, World } from '../world';
import { RestserviceService } from '../restservice.service';
import { MatProgressBar, MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  product: Product; 
  world: World;
  progressbar: MatProgressBar;
  progressbarvalue: number;
  lastupdate: number = Date.now();
  server = "http://localhost:8080/";
  _qtmulti: string;
  _money: number;
  
  @Input() 
  set prod(value: Product) { 
    this.product = value; 
    if (this.product && this.product.timeleft > 0) { 
      this.lastupdate = Date.now(); 
      let progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse; 
      this.progressbar.value = progress; 
    }
  } 

  @Input()
  set monde(value: World){
    this.world = value;
  }
  @Input() 
  set qtmulti(value: string) { 
    this._qtmulti = value; 
    if (this._qtmulti && this.product) this.calcMaxCanBuy(); 
  } 

  @Input() 
  set money(value: number) { 
    this._money = value; 
  }

  @Output() 
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

  @Output() 
  notifyBuy: EventEmitter<Number> = new EventEmitter<Number>();
  
  constructor(private service: RestserviceService) {}

  ngOnInit(): void {
    setInterval(() => { this.calcScore(); }, 100);
  }

  launchProduction(){
    if(this.product.quantite > 0 && this.product.timeleft === 0){
      this.product.timeleft = this.product.vitesse;
      if(!this.product.managerUnlocked){
        this.service.putProduct(this.product);
      }
    }
  }

  calcScore() {
    if(!(this.product.timeleft == 0)){
      var tempsEcoule = Date.now() - this.lastupdate;
      if(this.product.timeleft<=0){
        this.product.timeleft = 0;
        this.progressbarvalue = 0;
        this.notifyProduction.emit(this.product);
        if(this.product.managerUnlocked){
          this.launchProduction()
        }
      }else{
        this.product.timeleft -= tempsEcoule;
        this.progressbarvalue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;
      }
    }else{
      if(this.product.managerUnlocked){
        this.launchProduction();
      }
    }
    this.lastupdate = Date.now();
  }

  calcMaxCanBuy(): number {
    var qte = Math.log(1-(this._money/this.product.cout*(1-this.product.croissance)))/Math.log(this.product.croissance);
    return Math.floor(qte);
  }

  calcCout(qte: number): number{
    return this.product.cout*(1-Math.pow(this.product.croissance, qte))/(1-this.product.croissance);
  }

  calcUpgrade(unlock: Pallier){
    if(!unlock.unlocked){
      if(unlock.idcible == 0){
        this.world.products.product.forEach(p => {
          switch (unlock.typeratio.toUpperCase()) {
                  case "VITESSE":
                      var newVitesse = p.vitesse/unlock.ratio;
                      var tempsRestant = p.vitesse - p.timeleft;
                      p.vitesse = (newVitesse > 0) ? newVitesse : 1;
                      if(p.timeleft >= 0){
                        p.timeleft += tempsRestant/unlock.ratio;
                        this.progressbar.value = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
                      }
                      break;
                  case "GAIN":
                      p.revenu = p.revenu * unlock.ratio;
                      break;
                  case "ANGE":
                      this.world.angelbonus += unlock.ratio;
                      break;                
                  default:
                      break;
              }
        });
      }else{
          switch (unlock.typeratio.toUpperCase()) {
            case "VITESSE":
              var newVitesse = this.product.vitesse/unlock.ratio;
              var tempsRestant = this.product.vitesse - this.product.timeleft;
              this.product.vitesse = (newVitesse > 0) ? newVitesse : 1;
              if(this.product.timeleft >= 0){
                this.product.timeleft += tempsRestant/unlock.ratio;
                this.progressbar.value = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
              }
              break;
            case "GAIN":
                this.product.revenu = this.product.revenu * unlock.ratio;
                break;
            case "ANGE":
                this.world.angelbonus += unlock.ratio;
                break;                
            default:
                break;
        }
      }
      unlock.unlocked = true;
  }
  }

  canBuy(): boolean {
    switch(this._qtmulti){
      case "x1":
      case "Max":
        return this.calcMaxCanBuy() >= 1;
      case "x10": 
        return this.calcMaxCanBuy() >= 10;
      case "x100": 
        return this.calcMaxCanBuy() >= 100;
    }
  }

  onBuy(): void {
    switch(this._qtmulti){
      case "x1":
        this.product.quantite += 1;
        this.notifyBuy.emit(this.calcCout(1));
        this.product.cout = this.product.cout * this.product.croissance;
        break;
      case "x10": 
        this.product.quantite += 10;
        this.notifyBuy.emit(this.calcCout(10));
        this.product.cout = this.product.cout * Math.pow(this.product.croissance, 10);
        break;
      case "x100": 
        this.product.quantite += 100;
        this.notifyBuy.emit(this.calcCout(100));
        this.product.cout = this.product.cout * Math.pow(this.product.croissance, 100);
        break;
      case "Max":
          this.product.quantite += this.calcMaxCanBuy();
          this.notifyBuy.emit(this.calcCout(this.calcMaxCanBuy()));
          this.product.cout = this.product.cout * Math.pow(this.product.croissance, this.calcMaxCanBuy());
        break;
    }
    this.product.palliers.pallier.filter(p => p.seuil <= this.product.quantite && p.unlocked == false).forEach(unlock => {
      unlock.unlocked = true;
      this.calcUpgrade(unlock);
    });
    this.service.putProduct(this.product);
    console.log(this.product.cout);

    var minQteProduit = this.product.quantite;
    this.world.products.product.forEach(p => {
      minQteProduit = Math.min(minQteProduit, p.quantite);
    });
    
    this.world.allunlocks.pallier.filter(p => p.unlocked == false && p.seuil <= minQteProduit).forEach(p =>{
      this.calcUpgrade(p);
    });
  }

}
