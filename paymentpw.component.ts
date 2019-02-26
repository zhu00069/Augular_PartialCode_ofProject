import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationHandler } from '../../../providers/authentication-handler/authentication-handler';
import { PaymentProfileHandler } from '../../../providers/paymentprofile-handler/paymentprofile-handler';
import { SubscriptionHandler } from '../../../providers/subscription-handler/subscription-handler';

declare var Brick: any;

@Component({
  selector: 'app-payment-pw',
  templateUrl: './paymentpw.component.html',
  styleUrls: ['./paymentpw.component.css']
})
export class PaymentPWComponent implements OnInit {
	paymentMethods: any = [];
	amount: number;
	instanceName:string;
	balanceAmount: number = 0;
	chargeCreditFromCard:number;
	isCreditPurchase: boolean = false;
	payAmount:number;

	updateSubscriptionErrorMsg: string = "";
    updateSubscriptionError: boolean = false;
    subscriptionId: string;
	now = new Date();
	
	@Output()
	paymentAdded: EventEmitter<any> = new EventEmitter<any>();

	@Output()
	balanceUpdated: EventEmitter<any> = new EventEmitter<any>();

	@Output()
    subscriptionUpdated: EventEmitter<any> = new EventEmitter<any>();
	
	@Input()
	isPurchase: boolean = true;

	@Input()
	isUpdate: boolean;

	@Input()
	isTrial: boolean;

	
	@Input()
	anInstance:any =[];


	@Input()
	isNotEnough: boolean = true;

	@Input()
	totalAmount: number;

	@Input()
	initialPrice: number;

	@Input()
	isSubscriptionPurchase: boolean;

	@Input()
	taxtRate: number;
	
	@Input()
	purchasedInstance: any;

	@Input()
	packages : any[];

	@Input()
	subscriptionType: string;

	@Input()
	startDate: string;
	
	@Input()
	discountCode: string;

	@Input()
	subscriptionTotal: number;
	
	@Input()
	taxSum: number;

	totalTaxAmount: number;
	

	newCardFormGroup: FormGroup;
	purchaseCreditFormGroup: FormGroup;
	instanceNameFormGroup: FormGroup;
	brick : any;

	constructor(private router: Router,
			private _formBuilder: FormBuilder,
			private authenticationHandler: AuthenticationHandler,
			private subscriptionHandler: SubscriptionHandler,
			private paymentProfileHandler: PaymentProfileHandler) {
				
				this.newCardFormGroup = this._formBuilder.group({
				firstName: ['', Validators.required],
				lastName: ['', Validators.required],
				cardNumber: ['', Validators.required],
				CVV: ['', Validators.required],
				expiry_year: ['', Validators.required],
				expiry_month: ['', Validators.required],
				});
				this.purchaseCreditFormGroup = this._formBuilder.group({
					amount: ['', Validators.required],
				});
				this.instanceNameFormGroup = this._formBuilder.group({
					instanceName: ['', Validators.required],
				});


		}

	
   isFormLoading: boolean = false;
   AddCardErrorMsg: string = "";
   AddCardError: boolean = false;
   AddCardSuccessMsg: string = "";
   AddCardSuccess: boolean = false;
   BuyCreditSuccess: boolean = false;
   BuyCreditSuccessMsg:string ="";
  ngOnInit() {
	
		this.updatePaymentMethods();
		this.updateBalance();
		this.amountFromCredit();
		console.log(this.isTrial);
	
		
  	this.brick = new Brick({
    public_key: 't_87f4f8085bf99a183abbccb1bd11bc', // please update it to Brick live key before launch your project
    //amount: 9.99,
    //currency: 'USD',
    //container: 'payment-form-container',
    //action: 'http://user:pass@localhost:3445/api/billing/brick',
    form: {
      formatter: true
    }
  },'custom');
	
	}
	
	paymentCardChange(){
		this.updatePaymentMethods();
		console.log(this.paymentMethods);
	}
	
	updatePaymentMethods(){
		this.paymentProfileHandler.getAll().then((data)=>{
			//console.log(data);
			let data2 = JSON.parse(data);
			if(data2.returnCode == "false" || data2.returnCode == false){
				// Failed loading subscriptions
			}else{
				this.AddCardErrorMsg = "";
				this.AddCardError= false;
				this.AddCardSuccessMsg = "";
				this.AddCardSuccess = false;
				this.paymentMethods = data2.data;
				console.log(this.paymentMethods);
			}
		});
	}

	removePaymentMethod(aPaymentMethod) {
		// if(aPaymentMethod.isConfirmed){
		this.paymentProfileHandler.removePaymentMethod(aPaymentMethod._id).then((data)=>
		{
			console.log(data);
			let data2 = JSON.parse(data);
			if(data2.returnCode == "false" || data2.returnCode == false){
				// Failed loading subscriptions
			}else{
				this.updatePaymentMethods();
			}
		});
	   //}
	}
	updateBalance(){
		this.paymentProfileHandler.getAccountBalance().then((data)=>{
			//console.log(data);
			let data2 = JSON.parse(data);
			if(data2.returnCode == "false" || data2.returnCode == false){
				// Failed loading subscriptions
			}else{
				this.balanceAmount = data2.data.balance;
				this.balanceAmount = Math.round( this.balanceAmount  * 100 )/ 100
				//console.log(this.balanceAmount);
				
			}
			
		});
	}

	amountFromCredit(){
		// console.log(this.balanceAmount);
		// console.log(this.subscriptionTotal);
		// console.log(this.totalAmount);
		// console.log(this.taxSum);
		this.totalTaxAmount = this.totalAmount + this.taxSum;
		
		if(this.balanceAmount - this.totalTaxAmount < 0 ){
			this.chargeCreditFromCard = this.totalTaxAmount-this.balanceAmount;
			this.chargeCreditFromCard = Math.round( this.chargeCreditFromCard  * 100 )/ 100;
			this.isNotEnough = true;
		}else if(this.balanceAmount - this.totalTaxAmount >= 0){	
			this.chargeCreditFromCard = Math.round( this.chargeCreditFromCard  * 100 )/ 100;
			this.chargeCreditFromCard = 0;
			this.isNotEnough = false;
		}
	
		 return this.chargeCreditFromCard;
		 
	}

	toPay() {
		// console.log(this.balanceAmount);
		// console.log(this.totalTaxAmount);

		if(this.balanceAmount - this.totalTaxAmount >= 0){	
			this.chargeCreditFromCard = 0;
			this.isNotEnough = false;
	
	
		let dataIn: any = {};
		let loginStatus = this.authenticationHandler.isLoggedIn();
		dataIn.paymentByUserId = loginStatus[8];
		dataIn.accountId = loginStatus[3];
		dataIn.customerEmail = loginStatus[1];
		dataIn.name = this.instanceNameFormGroup.controls.instanceName.value;
		dataIn.price = this.subscriptionTotal;
		dataIn.products = [];
		dataIn.subscriptionType = this.subscriptionType;
		if(this.discountCode != null){
		dataIn.discountCode = this.discountCode;
		}
		console.log(dataIn);
		for (let idx in this.packages) {
			if (this.packages[idx].selected){		
				dataIn.products.push({"licenses":this.packages[idx].capacity, "productId": this.packages[idx]._id});
			}
		}

		this.subscriptionHandler.createSubscriptionBalance(dataIn).then((data)=>
		{ 	console.log(data);
			let data2 = JSON.parse(data);
			if(data2.returnCode == "true"){
				this.router.navigate(['/home']);
			}
		});	
	}


	}
	calculatePotentialEndDate(aStartDate){
	
		var now = new Date();
		var startDate = new Date(aStartDate);
		var nextMonth;
		
		if (now.getDate() < startDate.getDate()) {
			nextMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		}else{
			if (now.getMonth() == 11) {
				nextMonth = new Date(now.getFullYear() + 1, 0, 1);
			} else {
				nextMonth = new Date(now.getFullYear(), now.getMonth()+1, 1);
			}		
		}
		nextMonth.setDate(startDate.getDate());
		return nextMonth;
		
	}
	calculatePayAmount(){
		if(this.discountCode = null){
			var diffAmount = Math.round((this.totalAmount-this.initialPrice) * 100 )/ 100;
			var oneDay = 24*60*60*1000;
			var firstDate = new Date();
			var secondDate =this.calculatePotentialEndDate(this.anInstance.startDate);
			var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
			if(diffAmount>0){
				this.payAmount = (diffDays/30)*diffAmount;
			}else{
				this.payAmount = (diffAmount/30)*diffDays;	
			}
			return Math.round(this.payAmount*100)/100;

	   }else{
		
			var diffAmount = Math.round((this.subscriptionTotal-this.initialPrice) * 100 )/ 100;
			var oneDay = 24*60*60*1000;
			var firstDate = new Date();
			var secondDate =this.calculatePotentialEndDate(this.anInstance.startDate);
			var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
			if(diffAmount>0){
				this.payAmount = (diffDays/30)*diffAmount;
			}else{
				this.payAmount = (diffAmount/30)*diffDays;	
			}
			return Math.round(this.payAmount*100)/100;

	   }
	   
	}
	

	updateSubscription(anInstance) {
		// console.log(this.balanceAmount);
		// console.log(this.totalTaxAmount);

		if(this.balanceAmount - this.totalTaxAmount >= 0){	
			this.chargeCreditFromCard = 0;
			this.isNotEnough = false;

		let dataIn: any = {};
		dataIn.price = this.totalTaxAmount;	
		dataIn.products = [];
		//console.log(dataIn);
		
		for (let idx in this.packages) {
			if (this.packages[idx].selected){		
				dataIn.products.push({"licenses":this.packages[idx].capacity, "productId": this.packages[idx]._id});
			}
		}
		this.subscriptionHandler.subscriptionUpdateAfterPurchase(anInstance._id,dataIn).then((data)=>
		{
			let data2 = JSON.parse(data);
			// console.log(data2);
			// console.log(data2._id);
			if(data2.returnCode == "false" || data2.returnCode == false){
				this.updateSubscriptionError = true;
				this.updateSubscriptionErrorMsg = "Failed to update your subscription, " + data2.responseText;
				this.isFormLoading = false;
			}else{
				this.subscriptionId = data2._id;
				if(this.isUpdate) {
					this.subscriptionUpdated.emit();					
				} else {
					this.router.navigate(['/home']);
				}
	
			}
		});
	}
	}

	buyCreditWhenPurchase(){
		
		// console.log(this.balanceAmount);
		// console.log(this.totalTaxAmount);
		if(this.balanceAmount - this.totalTaxAmount < 0 ){
			this.chargeCreditFromCard = this.totalTaxAmount-this.balanceAmount;
			this.isNotEnough = true;
	
		let dataIn: any = {};
		let loginStatus = this.authenticationHandler.isLoggedIn();
		dataIn.paymentByUserId = loginStatus[8];
		dataIn.accountId = loginStatus[3];
		dataIn.initialChargeId = this.paymentMethods[0].initialChargeId;
		dataIn.amount = this.chargeCreditFromCard;
		console.log(dataIn);
		this.paymentProfileHandler.purchaseAccountCredit(dataIn).then((data)=>
		{ 	
			//console.log(data);
			let data2 = JSON.parse(data);
			if(data2.returnCode == "true"){
				this.BuyCreditSuccess = true;
				this.BuyCreditSuccessMsg = "Success.";
				this.isCreditPurchase = false;	
				this.balanceUpdated.emit();
				this.updateBalance();	
				
			}
		});
	}

	}
	buyCredit(){
		let dataIn: any = {};
		let loginStatus = this.authenticationHandler.isLoggedIn();
		dataIn.paymentByUserId = loginStatus[8];
		dataIn.accountId = loginStatus[3];
		dataIn.initialChargeId = this.paymentMethods[0].initialChargeId;
		dataIn.amount = this.purchaseCreditFormGroup.controls.amount.value;
		// console.log(this.paymentMethods);
		// console.log(dataIn);
		this.paymentProfileHandler.purchaseAccountCredit(dataIn).then((data)=>
		{ 	console.log("buy credit");
			console.log(data);
			let data2 = JSON.parse(data);
			if(data2.returnCode == "true"){
				this.BuyCreditSuccess = true;
				this.BuyCreditSuccessMsg = "Success.";
				this.isCreditPurchase = false;	
				this.balanceUpdated.emit();
			}
		});

	}


	finalizeAndPay(){
		this.AddCardErrorMsg = "";
		this.AddCardError= false;
		this.AddCardSuccessMsg = "";
		this.AddCardSuccess = false;
		this.isFormLoading = true;
		this.brick.tokenizeCard({ // Tokenize payment details
		card_number: this.newCardFormGroup.controls.cardNumber.value,
		card_expiration_month: this.newCardFormGroup.controls.expiry_month.value,
		card_expiration_year: this.newCardFormGroup.controls.expiry_year.value,
		card_cvv: this.newCardFormGroup.controls.CVV.value
		}, (response) => {
		this.isFormLoading = false;
		if (response.type == 'Error') { 
			// failed to create token
			// handle errors
			let errorStr = ""
			let p = response.error;
			for (let key in p) {
				if (p.hasOwnProperty(key) && key != '__proto__') {
					errorStr = errorStr + " •"+(key + " : " + p[key]);
				}
			}
			this.AddCardErrorMsg = errorStr;
			this.AddCardError= true;
			this.AddCardSuccessMsg = "";
			this.AddCardSuccess = false;
			//console.log(errorStr);
		} else { // token created successfully
			//console.log(response.token);
			//console.log(response.card.type);
			//console.log(response.card.last4);
			let dataIn: any = {};
			dataIn.token = response.token;
			dataIn.last4 = response.card.last4;
			dataIn.type = response.card.type;
			dataIn.isPermanent = false;
			dataIn.firstName = this.newCardFormGroup.controls.firstName.value;
			dataIn.lastName  = this.newCardFormGroup.controls.lastName.value;
			//console.log(dataIn);
		
			this.paymentProfileHandler.addPaymentMethod(dataIn).then((data)=>
				{ 	console.log(data);
					let data2 = JSON.parse(data);
					if(data2.returnCode == "true"){
						this.AddCardErrorMsg = "";
						this.AddCardError= false;
						this.AddCardSuccessMsg = "Successfully added.";
						this.AddCardSuccess = true;
						this.updatePaymentMethods();
						
					}else{
						this.AddCardErrorMsg = "Failed adding the card to your profile:" + data2.responseText;
						this.AddCardError= true;
						this.AddCardSuccessMsg = "";
						this.AddCardSuccess = false;
						location.reload();
					}
				},(err)=>{
					this.AddCardErrorMsg = "Failed adding the card to your profile.";
					this.AddCardError= true;
					this.AddCardSuccessMsg = "";
					this.AddCardSuccess = false;	
					location.reload();			
				}
			);
		}
		});
			
	}

	openCreditForm(){
		this.isCreditPurchase = true;
	}
	closeCreditForm(){
		this.isCreditPurchase = false;
	}

}
