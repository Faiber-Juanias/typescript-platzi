import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Team } from '../interfaces/team';

export const TeamsTableHeaders = ['name', 'country', 'players']

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  // Representa una colección de Team
  private teamDb: AngularFireList<Team>;

  /**
   * 
   * @param db Inyección de la BD de Firebase
   */
   constructor(private db: AngularFireDatabase) { 
    /**
     * Accedemos a la base de datos 'db' y listamos los 'teams'
     * @param ref hace referencia a 'teams' y ordena por 'name'
     */
    this.teamDb = this.db.list('/teams', ref => ref.orderByChild('name'))
  }

  /**
   * Retorna una lista de tipo Team
   * @returns Retorna un listado de Team
   */
  getTeams(): Observable<Team[]> {  
    return this.teamDb.snapshotChanges().pipe(
      map(changes => {
        return changes.map(c => ({ $key: c.payload.key, ... c.payload.val() } as Team))
      })
    )
  }

  /**
   * Permite a gregar un nuevo 'team'
   * @param team Recibe el tipo team a agregar
   * @returns 
   */
  addTeam(team: Team) {
    return this.teamDb.push(team)
  }

  /**
   * Permite eliminar un 'team'
   * @param id es el id del 'team' a eliminar
   */
  deleteTeam(id: string) {
    // Lista 'teams' y elimina por medio del id
    this.db.list('/teams').remove(id)
  }

  /**
   * Permite editar un 'player'
   * @param newTeamData es la data del 'player' a actualizar
   */
  editTeam(newTeamData) {
    const $key = newTeamData.$key;
    // Elimina la key del 'team' que existe
    delete(newTeamData.$key)
    // Actualiza el 'team'
    this.db.list('/teams').update($key, newTeamData)
  }

}
