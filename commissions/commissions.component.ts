import { Component, OnInit,Input,ChangeDetectorRef} from '@angular/core';
import * as moment from 'moment';
import { SalesHandlerService } from '../../sales/sales-handler.service';
import { AdministrationHandlerService} from '../../administration/administration-handler.service';
import { SubscriptionHandler } from '../../../providers/subscription-handler/subscription-handler';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
  selector: 'app-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.css']
})
export class CommissionsComponent implements OnInit {

  _filteredStartDate: string;
  _filteredEndDate: string;
  _filteredAgent: any;
    _filteredBranch: any;

  transactions: any = [];

  agentAmountCommission: number = 0;
  branchAmountCommission: number = 0;
  totalAmountAgentCommissions: number = 0;
  totalAmountBranchCommissions: number = 0;
  totolAmountCommissons: number = 0;

  _commission_angentName:string;
  _commission_branchName:string;

  
  @Input()
	set filteredStartDate(filteredStartDate: string) {
		this._filteredStartDate = filteredStartDate;
    this.filterDateUpdate();
	}

	@Input()
	set filteredEndDate(filteredEndDate: string) {
		this._filteredEndDate = filteredEndDate;
    this.filterDateUpdate();
  }

  @Input()
	set filteredBranch(_filteredBranch: any) {
		this._filteredBranch = _filteredBranch;
    this.filterDateUpdate(); 
	}
	
	@Input()
	set filteredAgent(_filteredAgent: any) {
		this._filteredAgent = _filteredAgent;
    this.filterDateUpdate();   
	}
	

  constructor(  
                private administrationHandlerService: AdministrationHandlerService,
                private subscriptionHandler : SubscriptionHandler,
                private cdRef:ChangeDetectorRef){ 

                
                }

  ngOnInit() {

    this.agentAmountCommission = 0;
    this.branchAmountCommission = 0;

    this.totalAmountAgentCommissions = 0;
    this.totalAmountBranchCommissions = 0;
    this.totolAmountCommissons = 0;

  }

    filterDateUpdate() {
      this.agentAmountCommission = 0;
      this.branchAmountCommission = 0;

      this.totalAmountAgentCommissions = 0;
      this.totalAmountBranchCommissions = 0;
      this.totolAmountCommissons = 0;

      var query="";

      if (this._filteredStartDate != null && this._filteredStartDate != 'All') {

        query = query + "startDate=" + this._filteredStartDate;
      }
      if (this._filteredEndDate != null && this._filteredEndDate != 'All') {
        query = query + "&endDate=" + this._filteredEndDate;
      }
      if(this._filteredAgent != null && this._filteredAgent._id !==undefined && this._filteredAgent != "All") {
        query = query + "&agent=" + this._filteredAgent._id;
        //console.log(this._filteredAgent._id);
      }
      if(this._filteredBranch != null && this._filteredBranch._id !==undefined && this._filteredBranch != "All") {
        query = query + "&branch=" + this._filteredBranch._id;
        //console.log(this._filteredBranch._id);
      }
      if (query != ""){
        this.subscriptionHandler.getCommissionsReporting(query).then((data)=>
        {	
          let data2 = JSON.parse(data);
          console.log(data2);
          if(data2.returnCode == "false" || data2.returnCode == false){
            // Failed loading 
          }else{
            this.transactions = data2.data;
            console.log(this.transactions);
            for(let idx in this.transactions){

              this.transactions[idx].total = Math.round( this.transactions[idx].total * 100 )/ 100;
              this.transactions[idx].tax = Math.round( this.transactions[idx].tax * 100 )/ 100;

              if(this.transactions[idx].commissionInfo != null){

                this.agentAmountCommission = (this.transactions[idx].commissionInfo.agentPercentage * this.transactions[idx].total)/100;
                this.branchAmountCommission = (this.transactions[idx].commissionInfo.branchPercentage * this.transactions[idx].total)/100;
                this.agentAmountCommission = Math.round( this.agentAmountCommission  * 100 )/ 100;
                this.branchAmountCommission = Math.round( this.branchAmountCommission  * 100 )/ 100;
                // console.log(this.agentPercentage);
                // console.log(this.branchPercentage);

                this._commission_angentName = this.transactions[idx].commissionInfo.agent.name;
                this._commission_branchName = this.transactions[idx].commissionInfo.branch.name;
                // console.log(this._commission_angentName);
                // console.log(this._commission_branchName);

                this.totalAmountAgentCommissions += this.agentAmountCommission;
                this.totalAmountBranchCommissions += this.branchAmountCommission;
                this.totolAmountCommissons =   this.totalAmountAgentCommissions + this.totalAmountBranchCommissions;
                // console.log(this.totalAmountAgentCommissions);
                // console.log(this.totalAmountBranchCommissions);
                // console.log(this.totolAmountCommissons);               
              }
            }
          }
     
        });	
      } 
		} 
     
    listToCsv(){
  
      let formattedtransactions: any = [];
        
      formattedtransactions.push({
          "Transaction ID": "Transaction ID",
          "Date": "Date",
          "Start Date": "Start Date",
          "End Date": "End Date",
          "Total": "Total",
          "Tax": "Tax",
          "Agent": "Agent",
          "Agent's Commission": "Agent's Commission",
          "Branch": "Branch",
          "Branch' Commission": "Branch' Commission"
          });		
    
        for (let idx in this.transactions) {
          
          formattedtransactions.push(
          {
          "Transaction ID": this.transactions[idx]._id,
          "Date": this.formatDate(this.transactions[idx].date),
          "Start Date": this.formatDate(this.transactions[idx].startDate),
          "End Date": this.formatDate(this.transactions[idx].endDate),
          "Total": '$'+this.transactions[idx].total,
          "Tax": '$'+this.transactions[idx].tax,
          "Agent": this.transactions[idx].commissionInfo ? this._commission_angentName : '-',
          "Agent's Commission": this.transactions[idx].commissionInfo ? '$'+this.agentAmountCommission : '0',
          "Brach": this.transactions[idx].commissionInfo ? this._commission_branchName : '-',
          "Branch' Commission": this.transactions[idx].commissionInfo ? '$'+this.branchAmountCommission : '0'
          });
        }
        new Angular2Csv(formattedtransactions, 'My Report');    
    }

  formatDate(date) {
		return moment(date).format('YYYY/MM/DD [-] h:mm A z');
  }
  
  formatDateInternal(date) {
		return moment(date).format('YYYY-MM-DD');
  }


}
