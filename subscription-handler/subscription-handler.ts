import { Injectable } from '@angular/core';
import { Http ,Response, Headers } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



import { ApiServerCallerProvider } from '../api-server-caller/api-server-caller';
import { AuthenticationHandler } from '../authentication-handler/authentication-handler';
import {BehaviorSubject} from 'rxjs/BehaviorSubject'; 

@Injectable()
export class SubscriptionHandler {

loginStatus : boolean = false;
public subscriptionSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
debugFlag: boolean = false;

constructor(private apiServerCallProvider : ApiServerCallerProvider, private authenticationHandler : AuthenticationHandler) {

}
 // use with .then  

createSubscription(dataIn){
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		dataIn.account = loginStatus[3];
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		return this.apiServerCallProvider.post("/subscriptions",dataIn,headers,"shop").subscribe((data)=>
				{ 	console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "successfully logged in.", "_id":data._id}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed registering user: "+ data.responseText}));
					}
				},(err)=>{
					resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}
	
//author: Bo
cancelSubscription(replacementSubscriptionId, dataIn) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		dataIn.account = loginStatus[3];
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		return this.apiServerCallProvider.put("/subscriptions/cancel/"+replacementSubscriptionId,dataIn,headers,"shop").subscribe((data)=>
				{ 	console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "successfully logged in.", "_id":data._id}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed registering user: "+ data.responseText}));
					}
				},(err)=>{
					resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}
	
//author: Bo
confirmPayment(dataIn){
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	return this.apiServerCallProvider.post("/billing/2co",dataIn,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully recorded payment.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection. "+ JSON.parse(err._body).responseText}));
			});
	});
}
	
//author: Bo
getProducts(){
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/products",headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved products.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
	
}
//author: Bo
getSubscriptions() {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/subscriptions?accountId="+loginStatus[3],headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}
//author: Bo
getSubscriptionsRoot(condition) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/subscriptions?"+condition,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}
//author: Bo
updateSubscriptions(subscriptionId,dataIn) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.put("/subscriptions/"+subscriptionId,dataIn,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}

updateProductRoot(dataIn,productId) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.put("/products/"+productId,dataIn,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}
//author: Bo
createProductRoot(dataIn) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.post("/products/",dataIn,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}
//author: Bo
deleteProductRoot(productId) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.delete("/products/"+productId,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}

getTransactions() {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/transactions?accountId="+loginStatus[3],headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}

refundInvoiceTransaction(dataIn, refundTransactionId) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.post("/refundTransaction/"+refundTransactionId, dataIn,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully refunded transaction.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}
//author: Bo
refundPaymentTransaction(dataIn, refundTransactionId) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.post("/refundCredit/"+refundTransactionId, dataIn,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully refunded transaction.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}

getTransactionsReporting(first) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/transactionsReporting?first="+first,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}

getTransactionsFailedReporting() {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/transactionsFailedReporting",headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}
//author: Bo
getCommissionsReporting(query){
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	//let url =  "/comissionssReporting?";
	// if(filteredStartDate != null && filteredStartDate.length > 0){
	//   url = url +"&startDate="+ filteredStartDate;
	// }
	// if(filteredEndDate != null && filteredEndDate.length > 0){
	//   url = url +"&endDate="+ filteredEndDate;
	// }
	// if (agent != null && agent.length > 0 && agent != "All") {
	// 	url = url +"&agent=" + agent;
	// }
	// if (branch != null && branch.length > 0 && branch != "All") {
	// 	url = url +"&branch=" + branch;
	// }
	// console.log(url);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/comissionssReporting?"+query,headers,"shop").subscribe((data)=>
		{ 	//console.log(data);
			resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved commissions.", "data":data}));
			  
		},(err)=>{
		  resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
		});
	}else {
	  resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
	
  }
//author: Bo
getTransactionsSummaryReporting(query) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/revenueSummaryReporting?"+query,headers,"shop").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}


getUserInformation(userId) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/user?userId="+userId,headers,"user").subscribe((data)=>
			{ 	
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved subscriptions.", "data":data}));
						
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}
//author: Bo
createSubscriptionBalance(dataIn){
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	dataIn.account = loginStatus[3];
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.post("/pbsubscription",dataIn,headers,"shop").subscribe((data)=>
			{ 	console.log(data);
				if(data.returnCode){
					resolve(JSON.stringify({"returnCode": "true","responseText": "successfully pay from balance.", data:data.data}));
				}else{
					resolve(JSON.stringify({"returnCode": "false","responseText": "Failed to pay from balance: "+ data.responseText}));
				}
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	} else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
	}
	});

}

cancelSubscriptionReason(_id, dataIn) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		dataIn.account = loginStatus[3];
		console.log(dataIn);
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		return this.apiServerCallProvider.put("/pbsubscription/cancel/"+_id,dataIn,headers,"shop").subscribe((data)=>
				{ 	console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "successfully cancle subscription.",  "_id":data._id}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed to cancle subscription: "+ data.responseText}));
					}
				},(err)=>{
					resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}
resumeSubscriptionAfterCancel(_id, dataIn) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		dataIn.account = loginStatus[3];
		//console.log(dataIn);
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		return this.apiServerCallProvider.put("/pbsubscription/resume/"+_id,dataIn,headers,"shop").subscribe((data)=>
				{ 	console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "successfully resume subscription", "_id":data._id}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed to resume subscription: "+ data.responseText}));
					}
				},(err)=>{
					resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}
subscriptionUpdateAfterPurchase(_id, dataIn) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		dataIn.account = loginStatus[3];
	    // console.log(dataIn);
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		return this.apiServerCallProvider.put("/pbsubscription/update/"+_id,dataIn,headers,"shop").subscribe((data)=>
				{ 	console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "successfully update subscription", "_id":data._id}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed to update subscription: "+ data.responseText}));
					}
				},(err)=>{
					resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
					console.log(err);
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}
//author: Bo
 getDiscountCode(Id) {
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.get("/discount/code/"+Id,headers,"sales").subscribe((data)=>
			{ 	console.log(data);
				if(data.length >= 1){
				  resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved coupon discount.", "data":data}));
		     	}else{
				  resolve(JSON.stringify({"returnCode": "false","responseText": "Your coupon code does not exist. "+ data.responseText}));
			    }	
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
	
 }



}
// PUT
// /pbsubscription/cancel/<>
//dataIn : {"endReason":"customer cancelled"}
// Result: "endDate" = "" , endReason=""


// resume
// PUT
// /pbsubscription/resume/<>

// update
// PUT
// /pbsubscription/update/<>
