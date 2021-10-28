import { Component, OnInit } from '@angular/core';
import {FieldType} from "@ngx-formly/material";
import {FormControl} from "@angular/forms";
import {debounceTime, startWith, switchMap} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {ApiService} from "sartography-workflow-lib";

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent extends FieldType implements OnInit {
    filter: Observable<Object[]>;
    selectedObject: Object; // The full object returned by the api, when one is selected.
    label: string;
    loading = false;
    numResults = 0;

    textInputControl = new FormControl('');

  constructor(
    protected api: ApiService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    if(this.value) {
      this.setSelectionFromValue(this.value);
    }

    this.filter = this.textInputControl.valueChanges.pipe(
      debounceTime(500),
      startWith(''),
      switchMap<string, Observable<Object[]>>(term => {
        if(term === this.selectedObject) {
          return EMPTY;  // Don't try to search for the selected object, only do this for strings.
        }
        this.value = "invalid";
        this.loading = true;
        return this.api.ldapLookup(term, this.to.limit);
      })
    );

    this.filter.subscribe(results => {
      this.loading = false;
      this.numResults = results.length;
      this.selectedObject = null;
    })
  }

  setSelectionFromValue(value: string) {
    this.api.lookupFieldOptions('', null, value, 1).subscribe(hits => {
      if(hits.length > 0) {
        this.selectedObject = hits[0]
        this.label = hits[0][this.to.label_column];
        this.value = value;
      } else {
        console.error("Failed to locate previous selection for auto-complete, leaving blank.")
      }
    })
  }

  state() {
    if(this.loading) {
      return "loading";
    } else if (this.selectedObject) {
      return "selected"
    } else if (this.numResults === 0) {
      return "no_results"
    } else {
      return "results"
    }
  }

  newSelection(selected: MatAutocompleteSelectedEvent) {
    this.selectedObject = selected.option.value;
    this.value = this.selectedObject[this.value];
    // Reset Label
    this.label = '';
    // Construct label and set value
    if ('display_name' in this.selectedObject) {
      this.label += this.selectedObject['display_name'];
    }
    if ('uid' in this.selectedObject) {
      this.value = this.selectedObject['uid'];
      this.label += (' ('  + this.selectedObject['uid'] + ')');
    }
  }

  displayFn(lookupData: Object): string {
    if (!lookupData) {
      return "";
    } else if (typeof lookupData === 'string') {
      return lookupData;
    } else {
      if ('uid' in lookupData && 'display_name' in lookupData) {
        return lookupData['uid'] + ' (' + lookupData['display_name'] + ')';
      } else {
        return "";
      }
    }
  }

}
