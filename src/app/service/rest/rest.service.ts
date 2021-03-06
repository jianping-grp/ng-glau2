import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {GlobalService} from "../global/global.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/catch';

@Injectable()
export class RestService {
  private REST_HOST = 'http://localhost:8000/api';
  private PER_PAGE = 10;

  constructor(private http: HttpClient,
              private globalService: GlobalService) {

  }

  private fetchData(url: string, includeParams=''): any {
    this.globalService.setLoading(true);
    return this.http.get(`${this.REST_HOST}/${url}/${includeParams}`)
      .finally(() => this.globalService.setLoading(false))
  }

  private fetchDataList(url: string, includeParam='', page=0, perPage=this.PER_PAGE){
    page = +(page) + 1;
    this.globalService.setLoading(true);
    return this.http.get(`${this.REST_HOST}/${url}${includeParam}?page=${page}&per_page=${perPage}`)
      .finally(() => this.globalService.setLoading(false)); //stop loading when finished or an error occur
  }

  private searchDataList(url: string, includeParam='', name: string, page=0, perPage=this.PER_PAGE) {
    page = +(page) + 1;
    this.globalService.setLoading(true);
    return this.http.get(`${this.REST_HOST}/${url}/${includeParam}&?{${name}.icontains}=Act&page=${page}&per_page=${perPage}`)
      .finally(() => this.globalService.setLoading(false));
  }

  postCompoundByStructure(smiles: string, similarity: number, page=0, perPage=this.PER_PAGE): Observable<any>{
    page= +(page) +1;
    const data= {smiles: "c1ccccc1", similarity: similarity, substructure_search: 0};
    this.globalService.setLoading(true);
    console.log(data);
    return this.http.post(`${this.REST_HOST}/compounds/search/?page=${page}&per_page=${perPage}`, data)
      .finally(() => this.globalService.setLoading(false))
      // .catch(this.handleError)
  }

  postCompoundBySubstructure(smiles:string, page=0, perPage=this.PER_PAGE): Observable<any> {
    page = +(page) + 1;
    const body={smiles: smiles, similarity: 0, substructure_search: 1};
    this.globalService.setLoading(true);
    return this.http.post(`${this.REST_HOST}/compounds/search/?page=${page}&per_page=${perPage}`, body)
      .finally(() => this.globalService.setLoading(false))
      .catch(this.handleError);
  }

  getCompoundList(includeParam,page?, perPage?): Observable<any> {
    return this.fetchDataList(`compounds/`,includeParam, page, perPage)
      .catch(this.handleError);
  }

  getUniprotList(includeParam ,page?, perPage?): Observable<any> {
    return this.fetchDataList(`uniprot-info/`,includeParam, page, perPage)
      .catch(this.handleError)
  }

  getProductList(includeParam, page?, perPage?): Observable<any> {
    return this.fetchDataList(`products/`, includeParam, page, perPage)
      .catch(this.handleError)
  }

  //get uniprot  by compounds id
  getUniprotByCid(id: any, includeParam, page?, perPage?): Observable<any> {
    return this.fetchDataList(`uniprot-info/?filter{compounds.id}=${id}&`, includeParam, page, perPage)
      .catch(this.handleError)
  }

  //get compounds by uniprot id
  getCompoundsByUid(id: any, includeParam, page?, perPage?): Observable<any> {
    return this.fetchDataList(`compounds/?filter{uniprotinfo_set.id}=${id}&`, includeParam, page, perPage)
      .catch(this.handleError)
  }

  //get Compound detail by compound id
  getCompoundDetail(id: any, includeParam): Observable<any> {
    return this.fetchData(`compounds/${id}`, includeParam)
      .catch(this.handleError)
  }

  //get Uniprot detail by uniprot id
  getUniprotDetail(id: any, includeParam): Observable<any> {
    return this.fetchData(`uniprot-info/${id}`, includeParam)
      .catch(this.handleError)
  }

  getCompoundByid(id: any, includeParams): Observable<any> {
    return this.fetchData(`compounds/${id}`, includeParams)
      .catch(this.handleError)
  }

  // getUniportByCid(id: any, includeParams): Observable<any> {
  //   return this.fetchData(`compounds/${id}`, includeParams)
  //     .catch(this.handleError)
  // }


//get compounds by product name
  getCompoundsByName(includeParam, name, page?, perPage?): Observable<any> {
    return this.searchDataList('products',includeParam, name, page, perPage)
      .catch(this.handleError)
  }



  private handleError(error: HttpErrorResponse | any ) {
    let errMsg: string;
      if(error instanceof HttpErrorResponse) {
      errMsg = `${error.status} - ${error.statusText || ''} ${error}`;
    }else {
      errMsg = error.message ? error.message : error.toString();
    }

    console.log(errMsg);
    return Promise.reject(errMsg);
}
}

