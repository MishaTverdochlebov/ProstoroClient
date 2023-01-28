import { Component, OnInit } from '@angular/core';
import { Agency } from 'src/app/core/models/agency';
import { AgenciesService } from 'src/app/core/services/agencies.service';
import { FormControl, FormGroup } from '@angular/forms';
import { tagOptions } from 'src/app/test-data/tags-data';
import { Tag } from 'src/app/core/models/tag';
import { cityOptions } from 'src/app/test-data/cities-data';
import { City } from 'src/app/core/models/city';

@Component({
  selector: 'app-agencies-page',
  templateUrl: './agencies-page.component.html',
  styleUrls: ['./agencies-page.component.css'],
})
export class AgenciesPageComponent implements OnInit {
  filterForm!: FormGroup;
  sorting: string = 'rating';
  tagOptions = tagOptions;
  filteredStyleTags: Tag[] = [];
  selectedStyleTags: Tag[] = [];
  cityOptions = cityOptions;
  filteredCities: City[] = [];
  selectedCity?: City;
  navMenuActive = false;
  loading = false;
  currentPageCount = 1;
  showMoreLoading = false;
  showMoreAvailable = false;
  filterApplied = false;
  filterButtonAvailable = false;
  constructor(private agenciesService: AgenciesService) {}

  agencies: Agency[];

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      tag: new FormControl(''),
      city: new FormControl(''),
      budget: new FormControl(''),
      remote: new FormControl(false),
    });
    this.loadAgencies();
  }

  submitFilter(): void {
    this.currentPageCount = 1;
    this.filterApplied = true;
    this.filterButtonAvailable = false;
    var params = {
      budget: this.filterForm.get('budget')?.value,
      remote: this.filterForm.get('remote')?.value,
      city: this.selectedCity ? this.selectedCity.value : '',
      tags: this.selectedStyleTags.map((t) => t.value),
      orderBy: this.sorting,
    };
    this.loading = true;
    this.agenciesService.get(params).subscribe((response) => {
      setTimeout(() => {
        this.loading = false;
        if (response.data.length == 10) {
          this.showMoreAvailable = true;
        }
      }, 100);
      this.agencies = response.data;
    });
  }

  loadAgencies(): void {
    this.currentPageCount = 1;
    this.loading = true;
    var params = {
      orderBy: this.sorting,
    };
    this.agenciesService.get(params).subscribe((response) => {
      setTimeout(() => {
        this.loading = false;
        if (response.data.length == 10) {
          this.showMoreAvailable = true;
        }
      }, 100);
      this.agencies = response.data;
    });
  }

  changeSorting(): void {
    setTimeout(() => {
      this.submitFilter();
    }, 10);
  }

  clearFilter(): void {
    this.filterForm.controls['budget'].setValue('');
    this.filterForm.controls['remote'].setValue(false);
    this.filterForm.controls['city'].setValue('');
    this.filterForm.controls['tag'].setValue('');
    this.selectedCity = undefined;
    this.selectedStyleTags = [];
    this.filterButtonAvailable = false;
    if (this.filterApplied) {
      this.filterApplied = false;
      this.loadAgencies();
    }
  }

  filterTags(tagType: string) {
    let filteredTags = this.tagOptions.filter(
      (item) =>
        item.type === tagType &&
        item.ua //???
          .toLowerCase()
          .includes(this.filterForm.get('tag')?.value.toLowerCase()) &&
        !this.isAddedTag(item)
    );
    this.filteredStyleTags = filteredTags.slice(0, 3);
  }
  isAddedTag(tag: Tag): boolean {
    return !!this.selectedStyleTags.find((t) => t.value === tag.value);
  }

  addTag(tag: Tag) {
    if (this.selectedStyleTags.length < 3) {
      this.selectedStyleTags.push(tag);
      this.filterForm.controls['tag'].setValue('');
      this.filterTags(tag.type);
      this.filterButtonAvailable = true;
    }
  }

  removeTag(tag: Tag) {
    const index = this.selectedStyleTags.indexOf(tag, 0);
    if (index > -1) {
      this.selectedStyleTags.splice(index, 1);
    }
    this.filterTags(tag.type);
    this.filterButtonAvailable = true;
  }

  filterCities() {
    this.selectedCity = undefined;
    let filteredCities = this.cityOptions.filter((city) =>
      city.ua
        .toLowerCase()
        .includes(this.filterForm.get('city')?.value.toLowerCase())
    );
    this.filteredCities = filteredCities.slice(0, 3);
  }

  selectCity(city: City) {
    this.selectedCity = city;
    this.filterForm.controls['city'].setValue(this.selectedCity.ua);
    this.filterButtonAvailable = true;
  }

  showMore() {
    this.showMoreLoading = true;
    this.showMoreAvailable = false;
    var params;
    if (this.filterApplied) {
      params = {
        budget: this.filterForm.get('budget')?.value,
        remote: this.filterForm.get('remote')?.value,
        city: this.selectedCity ? this.selectedCity.value : '',
        tags: this.selectedStyleTags.map((t) => t.value),
        orderBy: this.sorting,
        pageNumber: ++this.currentPageCount,
      };
    } else {
      params = {
        orderBy: this.sorting,
        pageNumber: ++this.currentPageCount,
      };
    }
    this.agenciesService.get(params).subscribe((response) => {
      this.showMoreLoading = false;
      if (response.data.length == 10) {
        this.showMoreAvailable = true;
      }
      this.agencies.push(...response.data);
    });
  }

  get clearFilterButtonAvailable(): boolean {
    return (
      this.filterForm.controls['budget'].value ||
      this.filterForm.controls['city'].value ||
      this.filterForm.controls['tag'].value ||
      this.filterForm.controls['remote'].value ||
      this.selectedCity ||
      this.selectedStyleTags.length ||
      this.filterApplied
    );
  }
}
