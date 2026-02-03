import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StorageService } from '../storage.service';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private baseUrl = 'https://music.fly.dev';

    // BehaviorSubject para mantener el estado de favoritos actualizado (IDs de canciones)
    private favoritesSubject = new BehaviorSubject<number[]>([]);
    public favorites$ = this.favoritesSubject.asObservable();

    // Mapping: trackId -> recordId (id del registro en la tabla de favoritos)
    private trackToRecordId = new Map<number, number>();

    constructor(
        private http: HttpClient,
        private storage: StorageService
    ) {
        this.loadInitialData();
    }

    private async loadInitialData() {
        const records = await this.storage.get('favorite_records') || [];
        this.updateInternalState(records);
    }

    private async updateInternalState(records: any[]) {
        console.log('[FavoritesService] Actualizando estado interno con registros:', records);
        this.trackToRecordId.clear();
        const trackIds: number[] = [];

        if (!Array.isArray(records)) {
            console.warn('[FavoritesService] Los registros no son un array:', records);
            return;
        }

        records.forEach((rec, index) => {
            const trackId = Number(rec.track_id || rec.id);
            const recordId = Number(rec.id);
            console.log(`[FavoritesService] Registro ${index}: trackId=${trackId}, recordId=${recordId}`);
            this.trackToRecordId.set(trackId, recordId);
            trackIds.push(trackId);
        });

        await this.storage.set('favorites', trackIds);
        await this.storage.set('favorite_records', records);
        this.favoritesSubject.next(trackIds);
    }

    // Obtener headers con autenticación
    private async getHeaders(): Promise<HttpHeaders> {
        const user = await this.storage.get('user');
        let headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        if (user && user.token) {
            headers = headers.set('Authorization', `Bearer ${user.token}`);
        }

        return headers;
    }

    // Obtener todos los favoritos del usuario
    getFavorites(): Promise<Observable<any[]>> {
        return Promise.all([this.getHeaders(), this.storage.get('user')]).then(([headers, user]) => {
            const userId = user?.id;
            const url = userId ? `${this.baseUrl}/user_favorites/${userId}` : `${this.baseUrl}/favorite_tracks`;

            return this.http.get<any[]>(url, { headers }).pipe(
                tap((favorites) => {
                    this.updateInternalState(favorites);
                })
            );
        });
    }

    // Validar si una canción está en favoritos
    async isFavorite(trackId: number): Promise<boolean> {
        return this.favoritesSubject.value.some(id => Number(id) === Number(trackId));
    }

    // Agregar una canción a favoritos
    async addToFavorites(trackId: number): Promise<Observable<any>> {
        const headers = await this.getHeaders();
        const user = await this.storage.get('user');

        return this.http.post<any>(`${this.baseUrl}/favorite_tracks`, {
            favorite_track: {
                track_id: trackId,
                user_id: user?.id
            }
        }, { headers }).pipe(
            tap(async (response) => {
                const records = await this.storage.get('favorite_records') || [];
                // Evitar duplicados en el estado local
                if (!records.some((r: any) => Number(r.id) === Number(response.id))) {
                    this.updateInternalState([...records, response]);
                }
            })
        );
    }

    // Eliminar una canción de favoritos
    async removeFromFavorites(trackId: number): Promise<Observable<any>> {
        const headers = await this.getHeaders();
        const user = await this.storage.get('user');
        const userId = user?.id;

        console.log(`[FavoritesService] Eliminando favorito via body: trackId=${trackId}, userId=${userId}`);

        // La API requiere DELETE a /remove_favorite con body JSON
        return this.http.request('delete', `${this.baseUrl}/remove_favorite`, {
            headers: headers,
            body: {
                user_id: userId,
                track_id: trackId
            }
        }).pipe(
            tap(async () => {
                console.log('[FavoritesService] Eliminado satisfactoriamente');
                const records = await this.storage.get('favorite_records') || [];
                const updated = records.filter((r: any) =>
                    Number(r.track_id || r.id) !== Number(trackId)
                );
                this.updateInternalState(updated);
            })
        );
    }

    // Toggle favorito (agregar o quitar)
    async toggleFavorite(trackId: number): Promise<Observable<any>> {
        const isFav = await this.isFavorite(trackId);
        return isFav ? this.removeFromFavorites(trackId) : this.addToFavorites(trackId);
    }

    // Limpiar favoritos (útil al cerrar sesión)
    async clearFavorites() {
        await this.storage.remove('favorites');
        await this.storage.remove('favorite_records');
        this.trackToRecordId.clear();
        this.favoritesSubject.next([]);
    }
}
