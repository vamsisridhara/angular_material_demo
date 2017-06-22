import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validator } from '@angular/forms';
import { Model } from './repository.model';
@Component({
    selector: 'product-root',
    templateUrl: './customer.component.html'
})
export class ProductComponent implements OnInit {
    customerForm: FormGroup;
    firstName: FormControl;
    prodLength: number;
    model: Model;
    ngOnInit(): void {

    }
    constructor(private fb: FormBuilder) {
        this.prodLength = this.model.getProducts().length;
    }

}