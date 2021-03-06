import {Component, OnInit} from "@angular/core";
import {Uniprot} from "../../../models/uniprot";
import {PageMeta} from "../../../models/page-meta";
import {RestService} from "../../../service/rest/rest.service";
import {ActivatedRoute, ParamMap, Params,} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {Compound} from "../../../models/compound";
import {UniprotListDataSource} from "../uniprot-list.data.source";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";


@Component({
  templateUrl: './uniprot-by-cid.component.html',
  styleUrls: ['./uniprot-by-cid.component.css'],
})

export class UniprotByCidComponent implements OnInit {
  compound: Compound;
  uniprot: Uniprot[];
  uniprotByCidDataSource: UniprotListDataSource;
  includeParam = '';
  displayedColumns: string[];
  pageMeta: PageMeta | null;

  constructor(private rest: RestService,
              private route: ActivatedRoute) {
    this.displayedColumns = ['entry', 'entryname'];
  }

  ngOnInit() {
    console.log('uniprot by Cid init');
    this._getData();
  }

  private _getData(page?, perPage?):void {
    this.route.paramMap
      .subscribe((params: ParamMap) => {
        let id = params.get('id');
        //fetch uniprot list by compound id
        this.rest.getUniprotByCid(id, this.includeParam, page, perPage)
          .subscribe(data => {
            this.uniprot = data['uniprot_infos'];
            this.uniprotByCidDataSource = new UniprotListDataSource(this.uniprot);
            this.pageMeta = data['meta'];
          },
          error => {},
            () => {},
            );
        //fetch compound detail
        this.rest.getCompoundDetail(id, this.includeParam)
          .subscribe(data => {
            this.compound = data['compound']
          })
    })

  }


  pageChange(event) {
    this._getData(event.pageIndex, event.pageSize)
  }
}


// export class UniprotByCidComponent implements OnInit {
//   id: any;
//   compound: Compound;
//   uniprotDetail: Uniprot[];
//   uniprotDetailDataSource: UniprotListDataSource;
//   displayedColumns: string[];
//   pageMeta: PageMeta | null;
//   includeParams = '?include[]=uniprotinfo_set';
//
//   constructor(private rest: RestService,
//               private route: ActivatedRoute) {
//     this.displayedColumns = ['entry', 'entryname'];
//   }
//
//   ngOnInit() {
//     console.log('uniprot detail init');
//     // this._getUniprotByid();
//     this.id = this.route.snapshot.paramMap.get('id');
//     console.log(this.id);
//     this.rest.getUniportByCid(this.id, this.includeParams)
//       .subscribe(data => {
//           this.compound = data['compound'];
//           this.uniprotDetail = this.compound.uniprotinfo_set;
//           this.uniprotDetailDataSource = new UniprotListDataSource(this.uniprotDetail)
//         },
//         error => {},
//         () => {});
//   }

  // private _getUniprotByid(): void {
  //
  // }
// private _getUniprotByid():void {
//   this.route.params
//     .switchMap((params: Params) =>
//       this.rest.getUniportByCid(params['id'], this.includeParams))
//     .subscribe(data => {
//       this.compound = data['compound'];
//       this.uniprotDetail = this.compound.uniprotinfo_set;
//       this.uniprotDetailDataSource = new UniprotDetailDataSource(this.uniprotDetail)
//       },
//           error => {},
//           () => {});
// }

//   pageChange(event){
//     this._getUniprotByid(event.pageIndex, event.pageSize);
//   }
// }
