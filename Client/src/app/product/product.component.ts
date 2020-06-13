import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../world';
import { RestserviceService } from '../restservice.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  service: RestserviceService;
  product: Product; 
  progressbarvalue: number;
  lastupdate: number = Date.now();
  _qtmulti: string;
  _money: number;
  
  @Input() 
  set prod(value: Product) { 
    this.product = value; 
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
  
  constructor() {}

  ngOnInit(): void {
    setInterval(() => { this.calcScore(); }, 100);
  }

  launchProduction(){
    this.product.timeleft = this.product.vitesse;
  }

  calcScore() {
    if(!(this.product.timeleft == 0)){
      var tempsEcoule = Date.now() - this.lastupdate;
      if(this.product.timeleft<=0){
        this.product.timeleft = 0;
        this.progressbarvalue = 0;
        this.notifyProduction.emit(this.product);
      }else{
        this.product.timeleft -= tempsEcoule;
        this.progressbarvalue = ((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100;
      }
    }
  }

  calcMaxCanBuy(): number {
    var qte = Math.log(1-(this._money/this.product.cout*(1-this.product.croissance)))/Math.log(this.product.croissance);
    return Math.floor(qte);
  }

  calcCout(qte: number): number{
    return this.product.cout*(1-Math.pow(this.product.croissance, qte))/(1-this.product.croissance);
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
    // this.service.putProduct(this.product);
  }

}
