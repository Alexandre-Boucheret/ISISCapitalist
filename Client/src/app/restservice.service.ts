import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { World, Pallier, Product } from './world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {
  server = "http://localhost:8080/";
  user = "";
  constructor(private http: HttpClient) { }

  getUser(): string{
    return this.user;
  };

  setUser(user: string): void{
    this.user = user;
  };

  getServer(): string{
    return this.server;
  }

  private handleError(error: any): Promise<any> { 
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error); 
  }; 
  
  getWorld(): Promise<World> { 
    return this.http.get(this.server + "adventureisis/generic/world", { headers: this.setHeaders(this.user) })
      .toPromise().catch(this.handleError); 
  };

  private setHeaders(user : string) : HttpHeaders {
    return new HttpHeaders({ "X-User": user });
  }

  putProduct(product: Product): Promise<Boolean> {
    return this.http.put(this.server + "adventureisis/generic/product", product, { headers: this.setHeaders(this.user)})
    .toPromise().catch(this.handleError);
  }

  putManager(manager : Pallier): Promise<Boolean> { 
    return this.http.put(this.server + "adventureisis/generic/manager", manager, { headers: this.setHeaders(this.user)} )
    .toPromise().catch(this.handleError);
  }

  putUpgrade(upgrade: Pallier) : Promise<Boolean> { 
    return this.http.put(this.server + "adventureisis/generic/upgrade", upgrade, { headers: this.setHeaders(this.user)} )
    .toPromise().catch(this.handleError);
  }

  deleteWorld() {
    return this.http.delete(this.server + "adventureisis/generic/world", { headers: this.setHeaders(this.user)} )
    .toPromise().catch(this.handleError);
  }

  putAngelUpgrade(upgrade: Pallier) {
    return this.http.put(this.server + "adventureisis/generic/angelupgrade", upgrade, { headers: this.setHeaders(this.user)} )
    .toPromise().catch(this.handleError);
  }

}
