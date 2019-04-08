import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthenticationHandler } from '../../../providers/authentication-handler/authentication-handler';
import { SubscriptionHandler } from '../../../providers/subscription-handler/subscription-handler';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
	
	@Input()
	subscriptionType: string;


	@Input()
	taxRate: number;
	
	@Input()
	discountRate: number = 0;

	@Input()
	discount: boolean;
	
	@Input()
	set totalPriceForm(totalPriceForm: number) {
		this._totalPriceForm = Math.round(totalPriceForm*100)/100;
		this.taxPrice = Math.round(this._totalPriceForm * this.taxRate*100)/100;
		this.calculateAll();
	}

	@Input()
	isUpdate: boolean = false;
	
	@Input()
	isSubscriptionPurchase: boolean;
	
	@Input()
	purchasedInstance: any;
	
	@Input()
	isTrial: boolean;
	
	@Input()
	packages : any[];
	
	@Input()
	orderFormNumber:number;

	
	paymentFormGroup: FormGroup;
	CountryCodes: any[];
  constructor(private router: Router,
		private _formBuilder: FormBuilder,
		private authenticationHandler: AuthenticationHandler,
		private subscriptionHandler: SubscriptionHandler) {
			this.finalizeFormGroup = this._formBuilder.group({
			  instanceName: ['', Validators.required]
			});
			
			this.paymentFormGroup = this._formBuilder.group({
			  checkoutName: ['', Validators.required],
			  checkoutAddress: ['', Validators.required],
			  checkoutCity: ['', Validators.required],
			  checkoutState: ['', Validators.required],
			  checkoutPostal: ['', Validators.required],
			  checkoutCountry: ['', Validators.required],
			  checkoutPhone: ['', [Validators.required, Validators.max(999999999999999), Validators.min(10000)]],
			});

	}
  subscriptionId: string;
  replacementSubscriptionId: string;
  accountId: string;
  newInvoice: string;
  finalizeFormGroup: FormGroup;
  _totalPriceForm: number;
  totalAll: number;
   productPurchaseDescription: string;
   isFormLoading: boolean = false;
   finalizeAndPayErrorMsg: string = "";
   finalizeAndPayError: boolean = false;
   recurrence: string;
   totalStartUpForm: number;
   taxPrice: number;
   customerEmail: string;
   checkoutAddress: string = "";
   checkoutCity: string = "";
   checkoutState: string = "";
   checkoutPostal: string = "";
   checkoutCountry: string = "";
   checkoutPhone: string = "";
  ngOnInit() {
	console.log(this.purchasedInstance);
	if (this.finalizeFormGroup != null && this.purchasedInstance != null && this.purchasedInstance.name != null) {
	  this.finalizeFormGroup.patchValue({
		instanceName:this.purchasedInstance.name
	  });
	}
	this.taxPrice = Math.round(this._totalPriceForm * this.taxRate*100)/100;
	this.calculateAll();
	this.calculateThisMonthTotal();
	
					
					
	this.CountryCodes = ["Afghanistan: +93","Albania: +355","Algeria: +213","American Samoa: +1","Andorra: +376","Angola: +244","Anguilla: +1","Antigua and Barbuda: +1","Argentina: +54","Armenia: +374","Aruba: +297","Ascension: +247","Australia: +61","Austria: +43","Azerbaijan: +994","Bahamas: +1","Bahrain: +973","Bangladesh: +880","Barbados: +1","Belarus: +375","Belgium: +32","Belize: +501","Benin: +229","Bermuda: +1","Bhutan: +975","Bolivia: +591","Bosnia and Herzegovina: +387","Botswana: +267","Brazil: +55","British Virgin Islands: +1","Brunei: +673","Bulgaria: +359","Burkina Faso: +226","Burundi: +257","Cambodia: +855","Cameroon: +237","Canada: +1","Cape Verde: +238","Cayman Islands: +1","Central African Republic: +236","Chad: +235","Chile: +56","China: +86","Colombia: +57","Comoros: +269","Congo: +242","Cook Islands: +682","Costa Rica: +506","Croatia: +385","Cuba: +53","Curacao: +599","Cyprus: +357","Czech Republic: +420","Democratic Republic of Congo: +243","Denmark: +45","Diego Garcia: +246","Djibouti: +253","Dominica: +1","Dominican Republic: +1","East Timor: +670","Ecuador: +593","Egypt: +20","El Salvador: +503","Equatorial Guinea: +240","Eritrea: +291","Estonia: +372","Ethiopia: +251","Falkland (Malvinas) Islands: +500","Faroe Islands: +298","Fiji: +679","Finland: +358","France: +33","French Guiana: +594","French Polynesia: +689","Gabon: +241","Gambia: +220","Georgia: +995","Germany: +49","Ghana: +233","Gibraltar: +350","Greece: +30","Greenland: +299","Grenada: +1","Guadeloupe: +590","Guam: +1","Guatemala: +502","Guinea: +224","Guinea-Bissau: +245","Guyana: +592","Haiti: +509","Honduras: +504","Hong Kong: +852","Hungary: +36","Iceland: +354","India: +91","Indonesia: +62","Inmarsat Satellite: +870","Iran: +98","Iraq: +964","Ireland: +353","Iridium Satellite: +8816/8817","Israel: +972","Italy: +39","Ivory Coast: +225","Jamaica: +1","Japan: +81","Jordan: +962","Kazakhstan: +7","Kenya: +254","Kiribati: +686","Kuwait: +965","Kyrgyzstan: +996","Laos: +856","Latvia: +371","Lebanon: +961","Lesotho: +266","Liberia: +231","Libya: +218","Liechtenstein: +423","Lithuania: +370","Luxembourg: +352","Macau: +853","Macedonia: +389","Madagascar: +261","Malawi: +265","Malaysia: +60","Maldives: +960","Mali: +223","Malta: +356","Marshall Islands: +692","Martinique: +596","Mauritania: +222","Mauritius: +230","Mayotte: +262","Mexico: +52","Micronesia: +691","Moldova: +373","Monaco: +377","Mongolia: +976","Montenegro: +382","Montserrat: +1","Morocco: +212","Mozambique: +258","Myanmar: +95","Namibia: +264","Nauru: +674","Nepal: +977","Netherlands: +31","Netherlands Antilles: +599","New Caledonia: +687","New Zealand: +64","Nicaragua: +505","Niger: +227","Nigeria: +234","Niue: +683","Norfolk Island: +6723","North Korea: +850","Northern Marianas: +1","Norway: +47","Oman: +968","Pakistan: +92","Palau: +680","Palestine: +970","Panama: +507","Papua New Guinea: +675","Paraguay: +595","Peru: +51","Philippines: +63","Poland: +48","Portugal: +351","Puerto Rico: +1","Qatar: +974","Reunion: +262","Romania: +40","Russian Federation: +7","Rwanda: +250","Saint Helena: +290","Saint Kitts and Nevis: +1","Saint Lucia: +1","Saint Barthelemy: +590","Saint Martin (French part): +590","Saint Pierre and Miquelon: +508","Saint Vincent and the Grenadines: +1","Samoa: +685","San Marino: +378","Sao Tome and Principe: +239","Saudi Arabia: +966","Senegal: +221","Serbia: +381","Seychelles: +248","Sierra Leone: +232","Singapore: +65","Sint Maarten: +1","Slovakia: +421","Slovenia: +386","Solomon Islands: +677","Somalia: +252","South Africa: +27","South Korea: +82","South Sudan: +211","Spain: +34","Sri Lanka: +94","Sudan: +249","Suriname: +597","Swaziland: +268","Sweden: +46","Switzerland: +41","Syria: +963","Taiwan: +886","Tajikistan: +992","Tanzania: +255","Thailand: +66","Thuraya Satellite: +882 16","Togo: +228","Tokelau: +690","Tonga: +676","Trinidad and Tobago: +1","Tunisia: +216","Turkey: +90","Turkmenistan: +993","Turks and Caicos Islands: +1","Tuvalu: +688","Uganda: +256","Ukraine: +380","United Arab Emirates: +971","United Kingdom: +44","United States of America: +1","U.S. Virgin Islands: +1","Uruguay: +598","Uzbekistan: +998","Vanuatu: +678","Vatican City: +379","Venezuela: +58","Vietnam: +84","Wallis and Futuna: +681","Yemen: +967","Zambia: +260","Zimbabwe: +263"];
	
  }
  
finalizeAndPay(){
	this.finalizeAndPayErrorMsg = "";
	if(!this.isFormLoading) {
		if(this.checkFormInputs() && this.paymentFormGroup.valid) {
			let loginStatus = this.authenticationHandler.isLoggedIn();
			this.accountId = loginStatus[3];
			this.customerEmail = loginStatus[1];
			if(this.isSubscriptionPurchase) {
				//Purchasing a subscription
				this.newInvoice = "true";
				this.productPurchaseDescription = 'Onyx Subscription plan';
				if (this.subscriptionType == 'monthly') {
					this.recurrence = "1 Month";
				} else {
					this.recurrence = "1 Year";
				}

				this.isFormLoading = true;
				this.finalizeAndPayError = false;
				let payload :any;
				payload = {};
				payload.products = [];
				for (let idx in this.packages) {
					if (this.packages[idx].selected){		
						payload.products.push({"licenses":this.packages[idx].capacity, "productId": this.packages[idx]._id});
					}
				}
				payload.account = loginStatus[3];
				this._totalPriceForm = Math.round(this._totalPriceForm*100)/100;
				payload.price = this.totalAll;

				payload.name = this.finalizeFormGroup.controls.instanceName.value;
				
				
				
				this.calculateThisMonthTotal(); 
				
				if (this.isTrial) {
					payload.paymentStatus = "paymentTrial";
				}
				this.subscriptionHandler.createSubscription(payload).then((data)=>
				{	
					let data2 = JSON.parse(data);
					//console.log(data2);
					if(data2.returnCode == "false" || data2.returnCode == false){
						this.finalizeAndPayError = true;
						this.finalizeAndPayErrorMsg = "Failed placing your order, " + data2.responseText;
						this.isFormLoading = false;
					}else{
						this.subscriptionId = data2._id;
						if(this.purchasedInstance != null && this.purchasedInstance._id != null) {
							this.replacementSubscriptionId = this.purchasedInstance._id;
						} else {
							this.replacementSubscriptionId = this.subscriptionId;
						}
						if(this.isTrial) {
							// There is no payment if subscription is trial
							this.isFormLoading = false;
							this.router.navigate(['/home']);
							location.reload();
						} else {
							this.twoCheckoutSubmitandGo(data2._id);
						}
					}
				});
			} else {
				//paying failed invoices
				this.newInvoice = "false";
				this.productPurchaseDescription = 'Onyx Invoice Payment';
				this.recurrence = "";
				this.twoCheckoutSubmitandGo(loginStatus[3]);
			}
		} else {
			this.finalizeAndPayErrorMsg = "Please fill in the missing fields.";
		}
	}
	
}

twoCheckoutSubmitandGo(_id) {

	this.checkoutCountry = this.paymentFormGroup.controls.checkoutCountry.value;
	(document.getElementById('country'+this.orderFormNumber) as HTMLInputElement).value = this.checkoutCountry;
	(document.getElementById('subscriptionId'+this.orderFormNumber) as HTMLInputElement).value = this.subscriptionId;
	(document.getElementById('replacementSubscriptionId'+this.orderFormNumber) as HTMLInputElement).value = this.replacementSubscriptionId;
	(document.getElementById('merchant_order_id'+this.orderFormNumber) as HTMLInputElement).value = _id;							
	(document.getElementById('newInvoice'+this.orderFormNumber) as HTMLInputElement).value = this.newInvoice;							
	(document.getElementById('accountId'+this.orderFormNumber) as HTMLInputElement).value = this.accountId;							
	(document.getElementById('customeremail'+this.orderFormNumber) as HTMLInputElement).value = this.customerEmail;							
	(document.getElementById('taxprice'+this.orderFormNumber) as HTMLInputElement).value = this.taxPrice.toString();
	(document.getElementById('recurrence'+this.orderFormNumber) as HTMLInputElement).value = this.recurrence.toString();
		
   (document.getElementById('2coform'+this.orderFormNumber) as HTMLFormElement).submit();
}

calculateThisMonthTotal(){
	let nextMonthDate = new Date();
	let daysInThisMonth = new Date(nextMonthDate.getFullYear(), nextMonthDate.getMonth()+1, 0).getDate()
	if (nextMonthDate.getMonth() != 11) {
		// handle new year
		nextMonthDate.setMonth(nextMonthDate.getMonth()+1);
	} else {
		nextMonthDate.setMonth(1);
		nextMonthDate.setFullYear(nextMonthDate.getFullYear()+1);
	}
	nextMonthDate.setDate(1);
	if (!this.isUpdate) {
		this.totalStartUpForm = Math.round(this.totalAll * Math.ceil((+nextMonthDate - +new Date())/ (1000 * 60 * 60 * 24 ))/daysInThisMonth *100)/100;
		if (this.discount) {
		this.totalStartUpForm = Math.round(this.totalStartUpForm * (1-this.discountRate)*100)/100;
		}
	} else {
		this.totalStartUpForm = 5;
	}
}

calculateAll() {
this.totalAll = Math.trunc((this._totalPriceForm+this.taxPrice)*100)/100;
return Math.trunc((this._totalPriceForm+this.taxPrice)*100)/100;

}

checkFormInputs() {
	if (!this.finalizeFormGroup.controls.instanceName.valid && this.isSubscriptionPurchase) {
		return false;
	} else {
		return true;
	}
}

}
