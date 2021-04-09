import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Team } from '../interfaces/team';
import { TeamService, TeamsTableHeaders } from '../services/team.service';
import { Countries } from '../interfaces/player';

@Component({
  selector: 'app-team-table',
  templateUrl: './team-table.component.html',
  styleUrls: ['./team-table.component.scss']
})
export class TeamTableComponent implements OnInit {

  public teams$: Observable<Team[]>;
  public tableHeaders = TeamsTableHeaders;

  constructor(private teamService: TeamService) { }

  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();
    this.teamService
      .getTeams() // Obtiene los teams
      .pipe(take(1)) // Toma solo uno
      .subscribe(teams => {
        if (teams.length === 0) { // Si no hay ningún team
          // Crea un nuevo Team
          const team: Team = {
            name: 'My amazing team',
            country: Countries.Argentina,
            players: null
          };
          this.teamService.addTeam(team);
        }
    });
  }

}
