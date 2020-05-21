import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-current-project-view',
  templateUrl: './current-project-view.component.html',
  styleUrls: ['./current-project-view.component.css']
})
export class CurrentProjectViewComponent implements OnInit {
    project_id: any;
    user_role: any;

    constructor( private route: ActivatedRoute, private router: Router) { 
        console.log('From the current project:');
        this.project_id = this.route.snapshot.paramMap.get('id');
        this.user_role = this.route.snapshot.paramMap.get('role');

        console.log(this.user_role);
        console.log(this.project_id);
    }

    ngOnInit() {
        
    }

}
