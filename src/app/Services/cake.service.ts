import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Cake } from '../Interfaces/cake.interface';

@Injectable({
  providedIn: 'root',
})
export class CakeService {
  // Backend APIs
  private base = 'https://localhost:7196/api/Cakes';
  private customizeBase = 'https://localhost:7196/api/CakeCustomize';

  constructor(private http: HttpClient) {}

  // ------------------ NORMAL CAKES ------------------
  getCakes(limit: number = 10): Observable<Cake[]> {
    return this.http.get<any[]>(`${this.base}?limit=${limit}`).pipe(
      map((items: any[]) =>
        (items || []).slice(0, limit).map((it: any, i: number) => ({
          id: it.id ?? i + 1,
          name: it.name ?? it.title ?? `Cake ${i + 1}`,
          flavor: it.flavor ?? it.flavour ?? undefined,
          imageUrl: this.normalizeImage(
            it.imageUrl ?? it.image ?? '',
            i + 1
          ),
          price:
            this.parsePrice(it.price) ??
            Math.round(10 + Math.random() * 40),
        }))
      ),
      catchError(() => of(this.fallbackCakes(limit)))
    );
  }

  // ------------------ CUSTOM CAKES ------------------
  getCustomCakes(limit: number = 12): Observable<Cake[]> {
    return this.http.get<any>(`${this.customizeBase}?limit=${limit}`).pipe(
      map((resp: any) => {
        const items: any[] = Array.isArray(resp)
          ? resp
          : resp?.data ?? resp?.result ?? [];

        return items.slice(0, limit).map((it: any, i: number) => ({
          id: it.id ?? it.cakeId ?? 10000 + i + 1,
          name:
            it.name ??
            it.title ??
            it.cakeName ??
            `Custom Cake ${i + 1}`,
          flavor: it.flavor ?? it.flavour ?? undefined,
          imageUrl: this.normalizeImage(
            it.imageUrl ??
              it.imageURL ??
              it.ImageUrl ??
              it.image ??
              it.imgUrl ??
              it.imagePath ??
              '',
            (i % 10) + 1
          ),
          price:
            this.parsePrice(
              it.price ?? it.Price ?? it.amount ?? it.cost
            ) ?? Math.round(20 + Math.random() * 30),
        }));
      }),
      catchError(() => of(this.fallbackCakes(limit)))
    );
  }

  // ------------------ IMAGE NORMALIZER ------------------
  private normalizeImage(src: string, index: number): string {
    let clean = (src || '').trim();
    clean = clean.replace(/assest/gi, 'assets');
    clean = clean.replace(/\\/g, '/');

    if (!clean) {
      return `/assets/Img/img-${index}.jpg`;
    }

    // Absolute URL
    if (/^https?:\/\//i.test(clean)) {
      const assetsIndex = clean.toLowerCase().indexOf('/assets/');
      if (assetsIndex >= 0) {
        return clean.substring(assetsIndex);
      }
      return clean;
    }

    // Frontend assets
    if (clean.startsWith('/assets/')) return clean;
    if (clean.startsWith('assets/')) return `/${clean}`;

    // Backend relative paths
    if (clean.startsWith('/')) {
      return `https://localhost:7196${clean}`;
    }

    if (/^(uploads|images|files)\//i.test(clean)) {
      return `https://localhost:7196/${clean}`;
    }

    // Only filename
    return `/assets/Img/${clean}`;
  }

  // ------------------ PRICE PARSER ------------------
  private parsePrice(val: any): number | null {
    if (val === null || val === undefined) return null;
    const num = Number(val);
    return isNaN(num) ? null : num;
  }

  // ------------------ FALLBACK DATA ------------------
  private fallbackCakes(limit: number): Cake[] {
    return Array.from({ length: limit }, (_, i) => ({
      id: i + 1,
      name: `Cake ${i + 1}`,
      flavor: i % 2 === 0 ? 'Chocolate' : 'Vanilla',
      imageUrl: `/assets/Img/img-${i + 1}.jpg`,
      price: Math.round(10 + Math.random() * 40),
    }));
  }
}
