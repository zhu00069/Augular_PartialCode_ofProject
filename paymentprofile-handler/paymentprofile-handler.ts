import { Injectable } from '@angular/core';
import { Http ,Response, Headers } from '@angular/http';
import { CookieService } from 'ngx-cookie';




import { ApiServerCallerProvider } from '../api-server-caller/api-server-caller';
import { AuthenticationHandler } from '../authentication-handler/authentication-handler';
import {BehaviorSubject} from 'rxjs'; 

@Injectable()
export class PaymentProfileHandler {

loginStatus : boolean = false;
public mySubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
public registrationEvent: BehaviorSubject<number> = new BehaviorSubject<number>(0);
username : string;
accountId : string;
userId : string;
token: string;
level: string;
name: string;
role: string;
roles: any = {};
debugFlag: boolean = false;

constructor(private apiServerCallProvider : ApiServerCallerProvider, 
			private authenticationHandler: AuthenticationHandler, 
			private cookieService:CookieService
			) {
			
}

addPaymentMethod(dataIn){
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		return this.apiServerCallProvider.put("/userpaymentprofile/"+loginStatus[1],dataIn,headers,"user").subscribe((data)=>
				{ 	console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "successfully added payment card."}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed registering new payment: "+ data.responseText}));
					}
				},(err)=>{
					let jsonBody: any;
					if (err._body != null) {
						try{
							jsonBody = JSON.parse(err._body);
							jsonBody = jsonBody.responseText;
						}
						catch (error){
							jsonBody = "";
						}
					}else {
						jsonBody = "";
					}
					resolve(JSON.stringify({"returnCode": "false","responseText": jsonBody}));
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}

getAll(){
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		return this.apiServerCallProvider.get("/userpaymentprofile/"+loginStatus[1],headers,"user").subscribe((data)=>
				{ 	//console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved payment cards.", data:data.data}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed retrieving payment cards: "+ data.responseText}));
					}
				},(err)=>{
					resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}

removePaymentMethod(_id){
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		return this.apiServerCallProvider.delete("/userpaymentprofile/"+loginStatus[1]+"/"+_id,headers,"user").subscribe((data)=>
				{ 	console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "successfully retrieved payment cards.", data:data.data}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed retrieving payment cards: "+ data.responseText}));
					}
				},(err)=>{
					resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}

getAccountBalance(){
	let loginStatus = this.authenticationHandler.isLoggedIn();
		let headers = new Headers();
		headers.append("Authorization", loginStatus[2]);
		return new Promise<string>(resolve => {
		if(loginStatus[0] == 'true') {
		let accountId = loginStatus[3];
		if (this.cookieService.get('viewing') == 'true' && 
		this.cookieService.get('accountId').length > 0) {
			accountId = this.cookieService.get('accountId');
		}
		return this.apiServerCallProvider.get("/accountBalance/"+accountId,headers,"shop").subscribe((data)=>
				{ 	//console.log(data);
					if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "Balance retrieved.", data:data.data}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed retrieving balance: "+ data.responseText}));
					}
				},(err)=>{
					resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
					//console.log(err);
				});
		} else {
			resolve(JSON.stringify({"returnCode": "false","responseText": "Session expired, please log out and log back in."}));
		}
		});
}

purchaseAccountCredit(dataIn){	
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.post("/accountBalance/", dataIn, headers,"shop").subscribe((data)=>
	     { 	console.log(data);
			if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "Success.", data:data.data}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed to purchase credit: "+ data.responseText}));
					}
			},(err)=>{
				resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
			});
	}else {
		resolve(JSON.stringify({"returnCode": "false","responseText": "There seems to be an issue with the server or your internet connection."}));
	}
	});
}

giveAccountCredit(dataIn){	
	let loginStatus = this.authenticationHandler.isLoggedIn();
	let headers = new Headers();
	headers.append("Authorization", loginStatus[2]);
	return new Promise<string>(resolve => {
	if(loginStatus[0] == 'true') {
	return this.apiServerCallProvider.post("/creditBalance/", dataIn, headers,"shop").subscribe((data)=>
	     { 	console.log(data);
			if(data.returnCode){
						resolve(JSON.stringify({"returnCode": "true","responseText": "Success.", data:data.data}));
					}else{
						resolve(JSON.stringify({"returnCode": "false","responseText": "Failed to give credit: "+ data.responseText}));
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