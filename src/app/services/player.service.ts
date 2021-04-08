import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  // Representa una colección de Player
  private playerDb: AngularFireList<Player>;

  /**
   * 
   * @param db Inyección de la BD de Firebase
   */
  constructor(private db: AngularFireDatabase) { 
    /**
     * Accedemos a la base de datos 'db' y listamos los 'players'
     * @param ref hace referencia a 'players' y ordena por 'name'
     */
    this.playerDb = this.db.list('/players', ref => ref.orderByChild('name'))
  }

  /**
   * Retorna una lista de tipo Player
   * @returns Retorna un listado de Player
   */
  getPlayers(): Observable<Player[]> {  
    return this.playerDb.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ $key: c.payload.key, ... c.payload.val() } as Player))
      })
    )
  }

  /**
   * Permite a gregar un nuevo 'player'
   * @param player Recibe el tipo player a agregar
   * @returns 
   */
  addPlayer(player: Player) {
    return this.playerDb.push(player)
  }

  /**
   * Permite eliminar un 'player'
   * @param id es el id del 'player' a eliminar
   */
  deletePlayer(id: string) {
    // Lista 'players' y elimina por medio del id
    this.db.list('/players').remove(id)
  }

  /**
   * Permite editar un 'player'
   * @param newPlayerData es la data del 'player' a actualizar
   */
  editPlayer(newPlayerData) {
    const $key = newPlayerData.$key;
    // Elimina la key del 'player' que existe
    delete(newPlayerData.$key)
    // Actualiza el 'player'
    this.db.list('/players').update($key, newPlayerData)
  }

}
