import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import { ConverterService } from '../../util/converter.service';
import { PRODUCT_REFERENCES_NORMALIZER } from '../connectors/references/converters';
import { ProductReferencesAdapter } from '../connectors/references/product-references.adapter';
import { UIProductReference } from '../model/product-reference-list';

@Injectable()
export class OccProductReferencesAdapter implements ProductReferencesAdapter {
  constructor(
    private http: HttpClient,
    private occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  load(
    productCode: string,
    referenceType?: string,
    pageSize?: number
  ): Observable<UIProductReference[]> {
    return this.http
      .get(this.getEndpoint(productCode, referenceType, pageSize))
      .pipe(this.converter.pipeable(PRODUCT_REFERENCES_NORMALIZER));
  }

  protected getEndpoint(
    code: string,
    reference?: string,
    pageSize?: number
  ): string {
    return this.occEndpoints.getUrl(
      'productReferences',
      {
        productCode: code,
      },
      { referenceType: reference, pageSize }
    );
  }
}