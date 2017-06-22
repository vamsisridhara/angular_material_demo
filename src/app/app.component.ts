import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validator, NgForm } from '@angular/forms';
import { Model } from './repository.model';
import { Product } from "app/product";
import { MdSelectChange } from "@angular/material/material";
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';

import 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinct';

@Component({
    selector: 'product-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    searchTerm: string = "";
    title: string = "Instant Search";
    results: any;
    latestSearch = new Subject<string>();
    prodLength: number;
    model: Model;
    selectedProduct: string;
    newProduct: Product = new Product();
    formSubmitted: boolean = false;
    latestChangeEvent: MdSelectChange;
    foods = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' }
    ];
    countries: any = [{ full: "Great Britain", short: "GB" }, { full: "United States", short: "US" }, { full: "Canada", short: "CA" }];
    selectedCountry: string = "";

    ngOnInit(): void {

    }
    constructor(private fb: FormBuilder, private _model: Model, public http: Http) {
        this.prodLength = this._model.getProducts().length;
        this.results = this.latestSearch
                        .debounceTime(500)
                        .distinct()
                        .filter(term => !!term)
                        .switchMap(term =>
                            this.http.get(`https://api.github.com/search/repositories?q=${this.searchTerm}&sort=starts&order=desc`)
                        .map(res => res.json().items.map(item => item.name)));

    }
    newSearchTerm(searchTerm) {
        this.latestSearch.next(this.searchTerm);
    }

    get jsonProduct() {
        return JSON.stringify(this.newProduct);
    }
    addProduct(p: Product) {
        console.log("New Product: " + this.jsonProduct);
    }

    submitForm(form: NgForm) {
        this.formSubmitted = true;
        if (form.valid) {
            this.addProduct(this.newProduct);
            this.newProduct = new Product();
            form.reset();
            this.formSubmitted = false;
        }
    }
    getFormValidationMessages(form: NgForm): string[] {
        let messages: string[] = [];
        Object.keys(form.controls).forEach(k => {
            this.getValidationMessages(form.controls[k], k)
                .forEach(m => messages.push(m));
        });
        return messages;
    }
    getValidationMessages(state: any, thingName?: string) {
        let thing: string = state.path || thingName;
        let messages: string[] = [];
        if (state.errors) {
            for (let errorName in state.errors) {
                switch (errorName) {
                    case "required":
                        messages.push(`You must enter a ${thing}`);
                        break;
                    case "minlength":
                        messages.push(`A ${thing} must be at least
                            ${state.errors['minlength'].requiredLength}
                            characters`);
                        break;
                    case "pattern":
                        messages.push(`The ${thing} contains illegal characters`);
                        break;
                }
            }
        }
        return messages;
    }
}