import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { JsonService } from 'src/app/services/json.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';


export interface PeriodicElement {
  name: string;
  images: string;
  id: number;
  date_created: string;
  price: number;
  actions: any;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'images', 'name', 'date_created','price','actions'];
  dataSource: any;
  user$ = this.usersService.currentUserProfile$;
  apiForm: FormGroup;
  get: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort,{static:true}) sort!: MatSort;
  initPaginator() {
    this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }
  constructor(private usersService: UsersService, public json: JsonService,public fb: FormBuilder) {
    this.apiForm = this.fb.group({
      consumer_key: [''],
      consumer_secret : [''],
      url : ['']
    });
  }
  getProducts(){
    this.get = this.apiForm.value;
    //alert(this.get.consumer_key);
    //alert(this.get.consumer_secret);
    //alert(this.get.url);
    let completeUrl=`${this.get.url}/wp-json/wc/v3/products?consumer_key=${this.get.consumer_key}&consumer_secret=${this.get.consumer_secret}`;
    console.log(completeUrl);
    //alert(completeUrl);
    //this.json.getJson('https://atum.betademo.es/wp-json/wc/v3/products?consumer_key=ck_9c8708e30e4fff70eccab7e98f6c5da4506d3e62&consumer_secret=cs_7913b74f48cd0174a97b0bc43d74dda6f04e63a8').subscribe((res:any)=>{
    this.json.getJson(completeUrl).subscribe((res:any)=>{
      console.log(res);
      
      //this.dataSource = res;
      
      for (let i=0; i < res.length; i++){
        if(res[i].images.length > 0)
        res[i].tax_class=res[i].images[0].src;
        else
        res[i].tax_class="https://atum.betademo.es/wp-content/uploads/woocommerce-placeholder-300x300.png";        
      }
      this.dataSource = new MatTableDataSource<PeriodicElement>(res);
      console.log(this.dataSource);
      this.initPaginator();
    })
  }
  applyFilter(event:any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {}
}
