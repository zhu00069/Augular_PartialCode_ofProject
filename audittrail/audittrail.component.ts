import { Component, OnInit } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FinanceHandlerService } from '../../finance/finance-handler.service';
import { AuthCheckComponent } from '../../sharedcomponents/authcheck.component';
import { AdministrationHandlerService } from '../../administration/administration-handler.service';
import { AuditTrailHandlerService } from '../../../providers/audit-trail-handler/audit-trail-handler.service';
import * as moment from 'moment';


@Component({
  selector: 'app-audittrail',
  templateUrl: './audittrail.component.html',
  styleUrls: ['./audittrail.component.css']
})
export class AudittrailComponent implements OnInit {
  filteredType: string ="";
  filteredStartDate: string = "";
  filteredEndDate: string = "";

  thisUser: any = [];
  types: any = ["All", "authentication", "shop", "training", "ticket", "community"];

  formIsLoading: boolean = false;
  transactions: string = "";
  auditMessages: any = [];
  countMessages: number; // how many total items there are in all pages
  loading = false; // check if content is being loaded
  page : number = 1; 
  pageSize:number;  // how many items we want to show per page

  lastPageReached :boolean = false;
  pageSizeFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder,
              private financeHandlerService: FinanceHandlerService,
              private authCheckComponent: AuthCheckComponent,
              private administrationHandlerService: AdministrationHandlerService,
              private audittrailHandlerService:AuditTrailHandlerService) {
        
              this.filteredType = "All";
              this.pageSizeFormGroup = this._formBuilder.group({
              pageSize: ['', Validators.required],
              });
        
   }
 

   ngOnInit() {

	 this.pageSizeFormGroup.patchValue({
	  pageSize: 100,
	  });
  }

  updateAuditTrails(){
  
   this.audittrailHandlerService.getAudittrailRoot(this.page,this.pageSizeFormGroup.controls.pageSize.value, this.filteredStartDate, this.filteredEndDate, this.filteredType).then((data)=> {
      let data2 = JSON.parse(data);
      if(data2.returnCode == "false" || data2.returnCode == false){
        // do nothing
      }else{
        let auditArray = data2.data;
        if(auditArray.length <= 0){
        this.lastPageReached = true;
       }else{
        this.auditMessages = auditArray;
        this.lastPageReached = false;
        console.log(this.auditMessages);
              
        this.countMessages = 0;
        for(var i = 0; i < this.auditMessages.length;i++){
            this.countMessages++;  
        }
        console.log(this.countMessages);
       }
   
      }  
    });

  }

  onPrev(){
    this.page--;
    console.log(this.page);
    this.updateAuditTrails();
    
  }

  onNext(): void {
  this.page++;
  console.log(this.page);
  this.updateAuditTrails();

  }
  lastPage(): boolean {
    return this.pageSize * this.page >= this.countMessages;
  }


  auditMessagesToCsv(){
		let formattedAuditMessage: any = [];
		
		formattedAuditMessage.push({
			"user": "Users",
			"status": "Status",
			"event_type": "Event Type",
			"event_details": "Event Details",
			"event_date": "Event Date"
			});
		
		for (let idx in this.auditMessages) {
		if(this.filteredType == 'All' || this.auditMessages[idx].type == this.filteredType){
          formattedAuditMessage.push({
				"user": this.auditMessages[idx]._id,
				"status": this.auditMessages[idx].status,
				"event_type": this.auditMessages[idx].type,
				"event_details": this.auditMessages[idx].details,
				"event_date": this.auditMessages[idx].createDate
				});
      }
		}
		new Angular2Csv(formattedAuditMessage, 'My Audit Trails Report');
 
	}
	

   formatDate(date) {
		return moment(date).format('YYYY/MM/DD [-] h:mm A z');
   }

}
