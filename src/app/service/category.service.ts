import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/categories/categories.component';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private host = environment.apiHost
  private baseUrl = "/api/categories"

  constructor(private http: HttpClient) { }

  create(category: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.host + this.baseUrl, category)
  }

  findAll(): Observable<FindAllCategoriesResponse> {
    return this.http.get<FindAllCategoriesResponse>(this.host + this.baseUrl)
  }

  delete(categoryId: number) {
    return this.http.delete(this.host + this.baseUrl + "/" + categoryId.toString())
  }

  save(category: Category): Observable<Category> {
    return this.http.put<Category>(this.host + this.baseUrl, category)
  }
}

export interface CreateCategoryRequest {
  name: String;
  description: String;
}

export interface FindAllCategoriesResponse {
  categories: Category[]
}
