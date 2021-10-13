import { Injectable } from '@angular/core'
import { Product } from '../products/product.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, shareReplay, tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'https://storerestservice.azurewebsites.net/api/products/';
  products$: Observable<Product[]>;

  constructor(private http: HttpClient) {
    this.initProducts();
  }

  getProductById(id: number): Observable<Product> {
    return this
              .products$
              .pipe(
                map(products => products.find(product => product.id === id))
              )
  }

  initProducts() {
    this.products$ = this
                      .http
                      .get<Product[]>(this.baseUrl)
                      .pipe(
                        delay(1500), // Fake delay!!
                        tap(console.table),
                        shareReplay(),
                        catchError(this.handleError)
                      );
  }

  private handleError(error: HttpErrorResponse) {
    // in a real world app, you may send the error to the server using some remote logging infrastructure
    // instead of just logging it to the console
    let errorMsg: string;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMsg = 'An error occurred:' + error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      errorMsg = `Backend returned code ${error.status}, body was: ${error.error}`;
    }
    console.error(errorMsg);
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

}
